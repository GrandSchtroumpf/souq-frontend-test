import { component$, useStyles$, Slot, useContextProvider, createContextId } from "@builder.io/qwik";
import { useBucketProvider } from '~/components/bucket/bucket';
import type { CollectionToken, Pool } from "~/models";
import poolData from '~/DATA.json';
import styles from './layout.css?inline';

interface PoolService {
  pool: Pool;
  tokens: Record<string, CollectionToken>;
}

export const PoolContext = createContextId<PoolService>('PoolContext');

export default component$(() => {
  useStyles$(styles);
  const pool = poolData as Pool;
  const tokens: Record<string, CollectionToken> = {};
  const allTokens = pool.subPools.map(subPool => subPool.shares.map(share => share.collectionToken)).flat();
  for (const token of allTokens) {
    tokens[token.id] = token;
  }

  useBucketProvider(poolData as Pool);
  useContextProvider(PoolContext, { pool, tokens });
  return <Slot />;
})