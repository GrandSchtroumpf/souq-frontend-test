import { component$, useStyles$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { Pool } from "~/models";
import poolData from '~/DATA.json';
import styles from './index.css?inline';

export default component$(() => {
  useStyles$(styles);
  const { params } = useLocation();
  const pool = poolData as Pool;
  const { poolId, tokenId } = params;
  const token = pool.collectionTokens.find(item => item.id === tokenId);
  const index = pool.collectionTokens.findIndex(item => item.id === tokenId);
  if (!token?.metadata) return <p>No token found with id "{tokenId}"</p>
  return <main id="token-page">
    <nav aria-label="breadcrumb">
      <Link class="btn" href={'/pool/' + poolId + `#` + tokenId}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        {pool.name}
      </Link>
    </nav>
    <section class="surface token-details" aria-label={'Description of ' + token.metadata.name}>
      <img style={'view-transition-name: token-'+index} class="gradient token-img" src={token.metadata.image} height={450} width={300} alt="" />
      <header>
        <h1>{token.metadata.name}</h1>
        <h3>Token ID: {token.tokenId}</h3>
      </header>
      <article>
        
      </article>
    </section>
  </main>
})