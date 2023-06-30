import { component$, $, useStore, useVisibleTask$, useComputed$, useContextProvider, createContextId, useStyles$, useContext, useSignal } from "@builder.io/qwik";
import { Modal } from "qwik-hueeye";
import poolData from '~/DATA.json';
import type { CollectionToken } from "~/models";
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
    })

  }
  useContextProvider(BucketContext, service);
  return service;
}

export const Bucket = component$(() => {
  useStyles$(styles);
  const { total, bucket } = useContext(BucketContext);
  const open = useSignal(false);
  const tokenRecord: Record<string, CollectionToken> = {};
  for (const token of poolData.collectionTokens as CollectionToken[]) {
    tokenRecord[token.id] = token;
  }
  return <>
    <div class="bucket">
      <button class="btn-expand outline gradient" aria-expanded={!!total.value} onClick$={() => open.value = true}>
        <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M22 9h-4.79l-4.38-6.56c-.19-.28-.51-.42-.83-.42s-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1zM12 4.8L14.8 9H9.2L12 4.8zM18.5 19l-12.99.01L3.31 11H20.7l-2.2 8zM12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <p>Total {total.value}</p>
      </button>
    </div>
    <Modal open={open} type="sidenav">
      <ul class="bucket-list">
        {Object.entries(bucket).map(([id, amount]) => {
          const token = tokenRecord[id];
          return <li key={id}>
            <h4>{token.metadata?.name}</h4>
            <span>{amount}</span>
          </li>
        })}
      </ul>
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