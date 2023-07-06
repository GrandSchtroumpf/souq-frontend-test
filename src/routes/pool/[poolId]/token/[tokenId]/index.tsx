import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import type { StaticGenerateHandler} from "@builder.io/qwik-city";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { Attribute } from "~/models";
import { Bucket, BucketToken } from "~/components/bucket/bucket";
import { TokenImg } from "~/components/token-img";
import { PoolContext } from "../../layout";
import poolData from '~/DATA.json';
import styles from './index.scss?inline';

interface TokenTraitsProps {
  attributes: Attribute[] | null;
}
const TokenAttributes = component$(({ attributes }: TokenTraitsProps) => {
  if (!attributes) return <></>;
  return <ul class="attributes">
    {attributes.sort((a, b) => a.key.localeCompare(b.key)).map(attribute => (
    <li key={attribute.key}>
      <h4>{attribute.key}</h4>
      <p>{attribute.value}</p>
    </li>
    ))}
  </ul>
})

export default component$(() => {
  useStyles$(styles);
  const { params, prevUrl, url } = useLocation();
  const { pool, tokens } = useContext(PoolContext);
  const { poolId, tokenId } = params;
  const token = tokens[tokenId];

  // If previous nav, we want to go to the exact card
  const back = prevUrl && prevUrl.toString() !== url.toString()
    ? `${prevUrl.toString()}#${tokenId}`
    : `/pool/${poolId}`;

  if (!token?.metadata) return <p>No token found with id "{tokenId}"</p>
  return <main id="token-page">
    <nav aria-label="breadcrumb">
      <Link class="btn" href={back}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        {pool.name}
      </Link>
    </nav>
    <section class="surface token-details" aria-label={'Description of ' + token.metadata.name}>
      <TokenImg token={token} width={300} eager class="gradient token-img"/>
      <article aria-labelledby="token-name">
        <h1 id="token-name">{token.metadata.name}</h1>
        <p class="subtitle">
          Address: <a target="_blank" href={`https://etherscan.io/address/${token.collection.address}`}>{token.collection.address}</a><br/>
          Token ID: <b>{token.tokenId}</b>
        </p>
      </article>
      <article aria-label="token description">
        <p class="description">{token.metadata.description}</p>
      </article>
      <article aria-labelledby="token-attributes">
        <h3 id="token-attributes">Attributes</h3>
        <TokenAttributes attributes={token.metadata.attributes} />
      </article>
      <footer class="bucket-token" aria-labelledby="token-bucket">
        <h3 id="token-bucket">Add to your bucket</h3>
        <BucketToken token={token}/>
      </footer>
    </section>
    <Bucket />
  </main>
})

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const ids = poolData.subPools.map(subpool => subpool.shares.map(share => share.collectionToken.id)).flat();
  return {
    params: ids.map(tokenId => ({ poolId: '1f53a93b-9e8e-41fd-9b90-acfde6e5a6c2', tokenId }))
  };
};