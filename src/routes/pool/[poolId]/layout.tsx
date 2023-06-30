import { component$, useStyles$, Slot, useContextProvider, createContextId } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useBucketProvider } from '~/components/bucket/bucket';
import type { Pool } from "~/models";
import poolData from '~/DATA.json';
import styles from './layout.css?inline';


export const PoolContext = createContextId<Pool>('PoolContext');

export default component$(() => {
  useStyles$(styles);
  const { params } = useLocation();
  useBucketProvider(params.poolId);
  useContextProvider(PoolContext, poolData as Pool);
  return <Slot />;
})