import { component$, useStore, $, useStyles$, createContextId, useContext, useContextProvider } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Form, ToggleGroup, Toggle, FormField, Input } from "qwik-hueeye";
import type { CollectionToken, Pool } from "~/models";
import poolData from '~/DATA.json';
import styles from './index.css?inline';

interface TokenListProps {
  tokens: CollectionToken[];
}

const BucketContext = createContextId<Record<string, number>>('BucketContext');

const TokenList = component$(({ tokens }: TokenListProps) => {
  const bucket = useContext(BucketContext);
  const add = $((tokenId: string) => {
    bucket[tokenId] ||= 0;
    bucket[tokenId]++;
  });

  const remove = $((tokenId: string) => {
    bucket[tokenId] ||= 0;
    bucket[tokenId] = Math.max(bucket[tokenId] - 1, 0);
  });

  return <nav aria-label="List of tokens">
    <ul role="list" class="cards">
      {tokens.slice(0, 50).map((token, i) => (
      <li class="card" key={token.id} id={token.id}>
        <Link href={'./token/' + token.id}>
          <img style={'view-transition-name: token-'+i} src={token.metadata?.image} width="300" height="450" loading="lazy"/>
          <h3>{token.metadata?.name}</h3>
        </Link>
        <div class="actions">
          <button class="btn-icon" disabled={!bucket[token.id]} onClick$={() => remove(token.id)}>
            <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <span>{bucket[token.id] ?? 0}</span>
          <button class="btn-icon" onClick$={() => add(token.id)}>
            <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </li>
      ))}
    </ul>
  </nav>
})

export default component$(() => {
  useStyles$(styles);
  const pool = poolData as Pool;
  const bucket = useStore<Record<string, number>>({}, { deep: false });
  useContextProvider(BucketContext, bucket);
  return <main id="pool-page">
    <section id="pool" aria-labelledby="pool-title">
      <header id="pool-header">
        <h1 id="pool-title">{pool.collectionName}</h1>
      </header>
      <article id="pool-performance" aria-labelledby="pool-performance-title">
        <header>
          <h2 id="pool-performance-title">Pool Performance</h2>
          <Form initialValue={{time: 'all'}}>
            <ToggleGroup name="time" class="outline">
              <Toggle value="week">1W</Toggle>
              <Toggle value="month">1M</Toggle>
              <Toggle value="all">ALL</Toggle>
            </ToggleGroup>
          </Form>
        </header>

      </article>
      <article>

      </article>
    </section>
    <section aria-label="Tokens">
      <Form class="token-filters" role="search">
        <FormField class="outline">
          <Input name="search" type="search" aria-label="search" placeholder="Search"/>
        </FormField>
      </Form>
      <TokenList tokens={pool.collectionTokens} />
    </section>
  </main>

})