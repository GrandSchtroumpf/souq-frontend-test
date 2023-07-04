import { component$, createContextId, useComputed$, useContext, useContextProvider, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import type { Signal} from "@builder.io/qwik";
import { Form, ToggleGroup, Toggle, FormField, Input, Select, Option } from "qwik-hueeye";
import type { CollectionToken, Trait, Traits } from "~/models";
import { Bucket, BucketToken } from "~/components/bucket/bucket";
import styles from './index.css?inline';
import { Link, useLocation } from "@builder.io/qwik-city";
import { viewTransition } from "~/components/view-transition";
import { PoolContext } from "./layout";
import { useGridFocus } from "~/components/nav";

const TokenFilterContext = createContextId<Signal<TokenFilter>>('TokenFilterContext');
type TokenFilter = {
  q?: string;
  sort?: 'ASC' | 'DESC'
} & Partial<{
  [key in keyof Traits]: string[]
}>

/** Component used to load more tokens when it enters the view */
const LastItem = component$(({ ref, completed }: { ref: Signal<HTMLElement | undefined>, completed: boolean }) => {
  if (completed) return <></>;
  return <footer class="last-item" ref={ref} aria-hidden="true">
    <button disabled class="btn-fill">Loading Tokens</button>
  </footer>;
});

const sortTokenFn = (sort: 'ASC' | 'DESC' = 'ASC') => {
  const multiplicator = sort === 'ASC' ? 1 : -1;
  return (a: CollectionToken, b: CollectionToken) => {
    return multiplicator * (a.sales[0].unitPriceUSD - b.sales[0].unitPriceUSD)
  }
}

const TokenList = component$(() => {
  const ref = useSignal<HTMLElement>();
  const gridNavRef = useSignal<HTMLElement>();
  const pool = useContext(PoolContext);
  const filter = useContext(TokenFilterContext);
  const pagination = useSignal(50);
  const allTokens = pool.subPools.map(subPool => subPool.shares.map(share => share.collectionToken)).flat();
  const max = allTokens.length;
  const tokens = useComputed$(() => {
    const { q, sort, ...traits } = filter.value;
    return allTokens
    .filter((token) => {
      if (!token.sales) return false;
      if (q && !token.metadata?.name.toLocaleLowerCase().includes(q.toLocaleLowerCase())) return false;
      for (const [key, value] of Object.entries(traits)) {
        for (const attribute of token.metadata?.attributes ?? []) {
          if (attribute.key !== key) continue;
          if (!value.includes(attribute.value)) return false;
        }
      }
      return true;
    })
    .sort(sortTokenFn(sort))
    .slice(0, pagination.value);
  });

  useGridFocus(gridNavRef, 'li > a');

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

  return <nav ref={gridNavRef} aria-label="List of tokens">
    <ul role="list" class="cards">
      {tokens.value.map((token) => {
        const { id, metadata } = token;
        return <li class="card" key={id} id={id}>
          <Link href={'./token/' + id}>
            <img style={viewTransition(id)} src={metadata?.internalImg} width="300" height="450" loading="lazy"/>
            <h3>{metadata?.name}</h3>
            <footer class="actions" aria-label="Bucket for this token">
              <BucketToken token={token}/>
            </footer>
          </Link>
        </li>
      })}
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
    <Select aria-label={trait.name} name={trait.name} placeholder={trait.name} multi>
      {trait.options.map(({ name, value }) => <Option key={value} value={name}>{name}</Option>)}
    </Select>
  </FormField>
});


export default component$(() => {
  useStyles$(styles);
  const pool = useContext(PoolContext);
  const { url } = useLocation();
  const initialFilters: any = {};
  if (url.searchParams.get('q')) initialFilters['q'] = url.searchParams.get('q');
  if (url.searchParams.get('sort')) initialFilters['sort'] = url.searchParams.get('sort');
  for (const trait in pool.traits) {
    if (!url.searchParams.getAll(trait).length) continue;
    initialFilters[trait] = url.searchParams.getAll(trait);
  }
  const filter = useSignal<TokenFilter>(initialFilters);
  useContextProvider(TokenFilterContext, filter);
  useVisibleTask$(({ track }) => {
    track(() => filter.value);
    for (const [key, value] of Object.entries(filter.value)) {
      if (Array.isArray(value)) {
        url.searchParams.delete(key); // clear before appending
        value.forEach(v => url.searchParams.append(key, v));
      } else if (value !== '') {
        url.searchParams.set(key, value);
      }
    }
    history.replaceState(null, '', '?' + url.searchParams.toString());
  });
  
  return <main id="pool-page">
    <header id="pool-header">
      <img width={1920} height={450} src="https://i.seadn.io/gae/YPGHP7VAvzy-MCVU67CV85gSW_Di6LWbp-22LGEb3H6Yz9v4wOdAaAhiswnwwL5trMn8tZiJhgbdGuBN9wvpH10d_oGVjVIGM-zW5A?auto=format&dpr=1&w=1920"/>
    </header>
    <section id="pool" aria-label={pool.collectionName}>
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
      <Form class="token-filters" role="search" initialValue={filter.value} onChange$={v => filter.value = v}>
        <FormField class="outline">
          <Input name="q" type="search" aria-label="search" placeholder="Search"/>
        </FormField>
        <TraitListFilter />
      </Form>
      {/* Bucket before token list to focus before list */}
      <Bucket />
      <TokenList/>
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