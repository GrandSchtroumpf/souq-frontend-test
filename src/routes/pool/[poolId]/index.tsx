import { component$, useStyles$ } from "@builder.io/qwik";
import { Form, ToggleGroup, Toggle, FormField, Input } from "qwik-hueeye";
import type { CollectionToken, Pool } from "~/models";
import { Bucket, BucketToken } from "~/components/bucket/bucket";
import poolData from '~/DATA.json';
import styles from './index.css?inline';
import { Link } from "@builder.io/qwik-city";
import { viewTransition } from "~/components/view-transition";


interface TokenListProps {
  tokens: CollectionToken[];
}

const TokenList = component$(({ tokens }: TokenListProps) => {

  return <nav aria-label="List of tokens">
    <ul role="list" class="cards">
      {tokens.slice(0, 50).map((token) => (
      <li class="card" key={token.id} id={token.id}>
        <Link href={'./token/' + token.id}>
          <img style={viewTransition(token.id)} src={token.metadata?.image} width="300" height="450" loading="lazy"/>
          <h3>{token.metadata?.name}</h3>
        </Link>
        <BucketToken tokenId={token.id} aria-label="Bucket for this token"/>
      </li>
      ))}
    </ul>
  </nav>
});


export default component$(() => {
  useStyles$(styles);
  const pool = poolData as Pool;
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
      <Bucket />
    </section>
  </main>

})