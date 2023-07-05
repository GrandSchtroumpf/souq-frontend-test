import { component$, $, useStore, useVisibleTask$, useContextProvider, createContextId, useStyles$, useContext, useSignal, useComputed$, event$ } from "@builder.io/qwik";
import type { QwikMouseEvent } from "@builder.io/qwik";
import { Modal } from "qwik-hueeye";
import { useEthereum } from "~/hooks/ethereum";
import type { CollectionToken, Pool } from "~/models";
import { PoolContext } from "~/routes/pool/[poolId]/layout";
import styles from './bucket.css?inline';
import { getMME1155 } from "~/hooks/ethereum/contracts";
import { TokenImg } from "../token-img";

export type BucketService = ReturnType<typeof useBucketProvider>;

export const BucketContext = createContextId<BucketService>('BucketContext');

export const useBucketProvider = (pool: Pool) => {
  const { state } = useEthereum();
  const bucket = useStore<Record<string, number>>({}, {deep: false});
  const totalItems = useComputed$(() => Object.values(bucket).reduce((acc, value) => acc + value, 0));
  const total = useSignal(BigInt(0));
  const tokens: Record<string, CollectionToken> = {};
  const allTokens = pool.subPools.map(subPool => subPool.shares.map(share => share.collectionToken)).flat();
  for (const token of allTokens) {
    tokens[token.id] = token;
  }

  const save = $(() => {
    const data = JSON.stringify(bucket);
    localStorage.setItem(`bucket.${pool.id}`, data);
  });

  useVisibleTask$(() => {
    const local = JSON.parse(localStorage.getItem(`bucket.${pool.id}`) ?? '{}');
    for (const [key, value] of Object.entries(local)) {
      bucket[key] = value as number;
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => totalItems.value);
    if (!totalItems.value) {
      total.value = BigInt(0);
      return;
    } 
    const timeout = setTimeout(async () => {
      const amounts = [];
      const tokenIds = [];
      for (const [key, value] of Object.entries(bucket)) {
        amounts.push(value);
        tokenIds.push(tokens[key].tokenId);
      }
      if (!state.provider) throw new Error('You need a provider');
      const contract = getMME1155(state.provider);
      const quotation = await contract.getQuote(amounts, tokenIds, true, true);
      total.value = quotation.total;
    }, 300);
    return () => clearTimeout(timeout);
  })

  const service = {
    bucket,
    total,
    add: $((tokenId: string) => {
      bucket[tokenId] ||= 0;
      bucket[tokenId]++;
      save();
    }),
    remove: $((tokenId: string) => {
      bucket[tokenId] ||= 0;
      bucket[tokenId] = Math.max(bucket[tokenId] - 1, 0);
      save();
    }),
    clear: $((tokenId: string) => {
      bucket[tokenId] = 0; // trigger rerender
      delete bucket[tokenId];
    })
  }
  useContextProvider(BucketContext, service);
  return service;
}


export const Bucket = component$(() => {
  useStyles$(styles);
  const { getSigner } = useEthereum();
  const { total, bucket, clear } = useContext(BucketContext);
  const pool = useContext(PoolContext);
  const open = useSignal(false);
  const tokenRecord: Record<string, CollectionToken> = {};
  const allTokens = pool.subPools.map(subPool => subPool.shares.map(share => share.collectionToken)).flat();
  for (const token of allTokens) {
    tokenRecord[token.id] = token;
  }

  const buy = $(async () => {
    const signer = await getSigner();
    const contract = getMME1155(signer);
    const tokenIds = [];
    const requiredAmounts = [];
    const maxStable = 13234278; // From my tx in Etherscan
    for (const [id, amount] of Object.entries(bucket)) {
      tokenIds.push(tokenRecord[id].tokenId);
      requiredAmounts.push(amount);
    }
    contract.swapStable(requiredAmounts, tokenIds, maxStable);
  });

  return <>
    <div class="bucket-trigger">
      <button class="btn-expand outline gradient" aria-expanded={!!total.value} onClick$={() => open.value = true}>
        <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M22 9h-4.79l-4.38-6.56c-.19-.28-.51-.42-.83-.42s-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1zM12 4.8L14.8 9H9.2L12 4.8zM18.5 19l-12.99.01L3.31 11H20.7l-2.2 8zM12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <p>Total {total.value.toLocaleString()}</p>
      </button>
    </div>
    <Modal open={open} type="sidenav">
      <div class="bucket-wrapper">
        <header class="bucket-buy">
          <p>Total: {total.value.toLocaleString()}</p>
          <button class="btn-fill primary gradient" disabled={!total.value}  onClick$={buy}>Buy</button>
        </header>
        <ul class="bucket-list">
          {Object.keys(bucket).map(id => {
            const token = tokenRecord[id];
            return <li key={id}>
              <TokenImg token={token} width={150}/>
              <header>
                <h4>{token.metadata?.name}</h4>
                <button class="btn-icon" onClick$={() => clear(id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                  </svg>
                </button>
              </header>
              <footer>
                <BucketToken token={token}/>
              </footer>
            </li>
          })}
        </ul>
      </div>
    </Modal>
  </>
})

interface BucketTokenProps {
  token: CollectionToken;
}
const formatter = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 2 });
export const BucketToken = component$(({ token }: BucketTokenProps) => {
  const { bucket, add, remove } = useContext(BucketContext);
  const price = token.sales?.[0].unitPriceUSD ?? 0;
  const down = event$((event: QwikMouseEvent) => {
    event.stopPropagation();
    remove(token.id);
  });
  const up = event$((event: QwikMouseEvent) => {
    event.stopPropagation();
    add(token.id);
  });
  return <>
    <data style="margin-right: auto" value={price}>{`${formatter.format(price)} USDC`}</data>
    <button class="btn-icon" disabled={!bucket[token.id]} onClick$={down} preventdefault:click>
      <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M19 13H5v-2h14v2z"/>
      </svg>
    </button>
    <span>{bucket[token.id] ?? 0}</span>
    <button class="btn-icon" disabled={bucket[token.id] === token.supply} onClick$={up} preventdefault:click>
      <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    </button>
  </>
})