import { component$, useStyles$, Slot } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useBucketProvider } from '~/components/bucket/bucket';
import styles from './layout.css?inline';
export default component$(() => {
  useStyles$(styles);
  const { params } = useLocation();
  useBucketProvider(params.poolId);
  return <Slot />;
})