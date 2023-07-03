import { component$, $, useStore, useVisibleTask$, useComputed$, useContextProvider, createContextId, useStyles$, useContext, useSignal } from "@builder.io/qwik";
import { Contract } from "ethers";
import { Modal } from "qwik-hueeye";
import { useEthereum } from "~/hooks/ethereum";
import type { CollectionToken } from "~/models";
import { PoolContext } from "~/routes/pool/[poolId]/layout";
import MME1155ABI from "~/hooks/ethereum/abi/MME1155.json";
import styles from './bucket.css?inline';

export type BucketService = ReturnType<typeof useBucketProvider>;

export const BucketContext = createContextId<BucketService>('BucketContext');

export const useBucketProvider = (poolId: string) => {
  const bucket = useStore<Record<string, number>>({}, {deep: false});
  const total = useComputed$(() => Object.values(bucket).reduce((acc, value) => acc + value, 0))
  const save = $(() => {
    const data = JSON.stringify(bucket);
    localStorage.setItem(`bucket.${poolId}`, data);
  })
  useVisibleTask$(() => {
    const local = JSON.parse(localStorage.getItem(`bucket.${poolId}`) ?? '{}');
    for (const [key, value] of Object.entries(local)) {
      bucket[key] = value as number;
    }
  });
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
      delete bucket[tokenId];
    })
  }
  useContextProvider(BucketContext, service);
  return service;
}


export const Bucket = component$(() => {
  useStyles$(styles);
  const { state } = useEthereum();
  const { total, bucket, clear } = useContext(BucketContext);
  const pool = useContext(PoolContext);
  const open = useSignal(false);
  const tokenRecord: Record<string, CollectionToken> = {};
  for (const token of pool.collectionTokens) {
    tokenRecord[token.id] = token;
  }

  const buy = $(async () => {
    if (!state.provider) throw new Error('No provider. Use connect button');
    const signer = await state.provider.getSigner();
    const contract = new Contract('0x72f2A9e83c31686b7803AA1b9B822521901DaEa4', MME1155ABI, signer);
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
        <p>Total {total.value}</p>
      </button>
    </div>
    <Modal open={open} type="sidenav">
      <div class="bucket-wrapper">
        <ul class="bucket-list">
          {Object.keys(bucket).map(id => {
            const token = tokenRecord[id];
            return <li key={id}>
              <img src={token.metadata?.image} width="150" height="225" loading="lazy"/>
              <header>
                <h4>{token.metadata?.name}</h4>
                <button class="btn-icon" onClick$={() => clear(id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                  </svg>
                </button>
              </header>
              <footer>
                <BucketToken tokenId={id}/>
              </footer>
            </li>
          })}
        </ul>
        <footer class="bucket-buy">
          <p>Total: {total.value}</p>
          <button class="btn-fill primary" onClick$={buy}>Buy</button>
        </footer>
      </div>
    </Modal>
  </>
})

interface BucketTokenProps {
  tokenId: string;
}
export const BucketToken = component$(({ tokenId }: BucketTokenProps) => {
  const { bucket, add, remove } = useContext(BucketContext);
  return <>
    <button class="btn-icon" disabled={!bucket[tokenId]} onClick$={() => remove(tokenId)}>
      <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M19 13H5v-2h14v2z"/>
      </svg>
    </button>
    <span>{bucket[tokenId] ?? 0}</span>
    <button class="btn-icon" onClick$={() => add(tokenId)}>
      <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    </button>
  </>
})