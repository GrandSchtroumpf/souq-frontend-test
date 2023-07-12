import { component$, useStyles$, Slot, useContextProvider, createContextId } from "@builder.io/qwik";
import { useBucketProvider } from '~/components/bucket/bucket';
import type { CollectionToken, Pool } from "~/models";
import pool from '~/DATA/pool.json';
import tokens from '~/DATA/tokens.json';
import styles from './layout.css?inline';

interface PoolService {
  pool: Pool;
  tokens: Record<string, CollectionToken>;
}

export const PoolContext = createContextId<PoolService>('PoolContext');

export default component$(() => {
  useStyles$(styles);
  useBucketProvider(pool, tokens);
  useContextProvider(PoolContext, { pool, tokens });
  return <Slot />;
})