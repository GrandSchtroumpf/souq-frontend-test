import { component$, useStyles$, Slot, useContextProvider, createContextId } from "@builder.io/qwik";
import { useBucketProvider } from '~/components/bucket/bucket';
import type { Pool } from "~/models";
import poolData from '~/DATA.json';
import styles from './layout.css?inline';


export const PoolContext = createContextId<Pool>('PoolContext');

export default component$(() => {
  useStyles$(styles);
  useBucketProvider(poolData as Pool);
  useContextProvider(PoolContext, poolData as Pool);
  return <Slot />;
})