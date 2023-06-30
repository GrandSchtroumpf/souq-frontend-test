import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { Attribute } from "~/models";
import { Bucket, BucketToken } from "~/components/bucket/bucket";
import { viewTransition } from "~/components/view-transition";
import { PoolContext } from "../../layout";
import styles from './index.css?inline';

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
  const { params } = useLocation();
  const pool = useContext(PoolContext);
  const { poolId, tokenId } = params;
  const token = pool.collectionTokens.find(item => item.id === tokenId);
  if (!token?.metadata) return <p>No token found with id "{tokenId}"</p>
  return <main id="token-page">
    <nav aria-label="breadcrumb">
      <Link class="btn" href={'/pool/' + poolId}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        {pool.name}
      </Link>
    </nav>
    <section class="surface token-details" aria-label={'Description of ' + token.metadata.name}>
      <img style={viewTransition(token.id)} class="gradient token-img" src={token.metadata.image} height={450} width={300} alt="" />
      <article aria-labelledby="token-name">
        <h1 id="token-name">{token.metadata.name}</h1>
        <h3>Token ID: {token.tokenId}</h3>
      </article>
      <article aria-labelledby="token-attributes">
        <h3 id="token-attributes">Attributes</h3>
        <TokenAttributes attributes={token.metadata.attributes} />
      </article>
      <footer class="bucket-token" aria-labelledby="token-bucket">
        <h3 id="token-bucket">Add to your bucket</h3>
        <BucketToken tokenId={tokenId}/>
      </footer>
    </section>
    <Bucket />
  </main>
})