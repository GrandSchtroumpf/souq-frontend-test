import { component$, useComputed$, useContext, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import type { Signal} from "@builder.io/qwik";
import { Form, ToggleGroup, Toggle, FormField, Input, Select, Option } from "qwik-hueeye";
import type { Trait } from "~/models";
import { Bucket, BucketToken } from "~/components/bucket/bucket";
import styles from './index.css?inline';
import { Link } from "@builder.io/qwik-city";
import { viewTransition } from "~/components/view-transition";
import { PoolContext } from "./layout";

/** Component used to load more tokens when it enters the view */
const LastItem = component$(({ ref, completed }: { ref: Signal<HTMLElement | undefined>, completed: boolean }) => {
  if (completed) return <></>;
  return <footer class="last-item" ref={ref} aria-hidden="true">
    <button disabled class="btn-fill">Loading Tokens</button>
  </footer>;
})

const TokenList = component$(() => {
  const ref = useSignal<HTMLElement>();
  const pool = useContext(PoolContext);
  const pagination = useSignal(50);
  const max = pool.collectionTokens.length;
  const tokens = useComputed$(() => {
    return pool.collectionTokens.slice(0, pagination.value);
  });

  // Pagination
  useVisibleTask$(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const next = pagination.value + 50;
      pagination.value = Math.min(max, next);
      if (next >= max) observer.disconnect();
    }, {
      rootMargin: '300px 0px'
    });
    observer.observe(ref.value!);
    return () => observer.disconnect();
  });

  return <nav aria-label="List of tokens">
    <ul ref={ref} role="list" class="cards">
      {tokens.value.map((token) => (
      <li class="card" key={token.id} id={token.id}>
        <Link href={'./token/' + token.id}>
          <img style={viewTransition(token.id)} src={token.metadata?.image} width="300" height="450" loading="lazy"/>
          <h3>{token.metadata?.name}</h3>
        </Link>
        <footer class="actions" aria-label="Bucket for this token">
          <BucketToken tokenId={token.id}/>
        </footer>
      </li>
      ))}
    </ul>
    <LastItem ref={ref} completed={max === pagination.value}/>
  </nav>
});

const TraitListFilter = component$(() => {
  const pool = useContext(PoolContext);
  return <ul role="list" class="filter-list">
    {Object.values(pool.traits).map(trait => (
      <li key={trait.name}>
        <TraitTokenFilter trait={trait}/>
      </li>
    ))}
  </ul>
});

interface TraitTokenFilterProps {
  trait: Trait;
}
const TraitTokenFilter = component$(({ trait }: TraitTokenFilterProps) => {
  return <FormField class="outline">
    <Select aria-label={trait.name} name={trait.name} placeholder={trait.name}>
      <Option value="">-- {trait.name} --</Option>
      {trait.options.map(({ name, value }) => <Option key={value} value={value.toString()}>{name}</Option>)}
    </Select>
  </FormField>
});


export default component$(() => {
  useStyles$(styles);
  const pool = useContext(PoolContext);
  
  return <main id="pool-page">
    <section id="pool" aria-label={pool.collectionName}>
      <header id="pool-header">
        <img width={2000} height={450} src="https://i.seadn.io/gae/YPGHP7VAvzy-MCVU67CV85gSW_Di6LWbp-22LGEb3H6Yz9v4wOdAaAhiswnwwL5trMn8tZiJhgbdGuBN9wvpH10d_oGVjVIGM-zW5A?auto=format&dpr=1&w=1920"/>
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
        <TraitListFilter />
      </Form>
      <TokenList/>
      <Bucket />
      <div class="go-top tooltip-right" aria-label="Scroll to top">
        <a href="#pool-header" class="btn-expand fill">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
          </svg>
        </a>
      </div>
    </section>
  </main>

})