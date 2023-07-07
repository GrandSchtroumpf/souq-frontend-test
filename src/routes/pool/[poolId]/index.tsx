import { $, component$, createContextId, useComputed$, useContext, useContextProvider, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import type { Signal} from "@builder.io/qwik";
import { Form, FormField, Input, Select, Option } from "qwik-hueeye";
import type { CollectionToken, Trait, Traits } from "~/models";
import { Bucket, BucketToken } from "~/components/bucket/bucket";
import styles from './index.css?inline';
import type { DocumentHead, StaticGenerateHandler} from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { PoolContext } from "./layout";
import { useGridFocus } from "~/components/nav";
import { TokenImg } from "~/components/token-img";
import poolData from '~/DATA.json';

const TokenFilterContext = createContextId<Signal<TokenFilter>>('TokenFilterContext');
type TokenFilter = {
  q?: string;
  sort?: 'ASC' | 'DESC'
} & Partial<{
  [key in keyof Traits]: string[]
}>

interface LastItemProps {
  amount: number;
  max: number
}
/** Component used to load more tokens when it enters the view */
const LastItem = component$(({ amount, max }: LastItemProps) => {
  if (amount === max) return <></>;
  return <button disabled class="btn-fill">Loading Tokens {amount} / {max}</button>;
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
  const { tokens } = useContext(PoolContext);
  const filter = useContext(TokenFilterContext);
  const pagination = useSignal(50);
  const allTokens = Object.values(tokens);
  const max = allTokens.length;
  const filteredTokens = useComputed$(() => {
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
    .sort(sortTokenFn(sort));
  });
  const paginatedTokens = useComputed$(() => filteredTokens.value.slice(0, pagination.value));

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

  return <nav ref={gridNavRef} aria-label="List of tokens" class="token-nav">
    <ul role="list" class="cards">
      {paginatedTokens.value.map((token) => {
        const { id, metadata } = token;
        return <li class="card" key={id} id={id}>
          <a href={'./token/' + id}>
            <TokenImg width={300} token={token}/>
            <h3>{metadata?.name}</h3>
            <footer class="actions" aria-label="Bucket for this token" preventdefault:click onClick$={e => e.stopPropagation()}>
              <BucketToken token={token}/>
            </footer>
          </a>
        </li>
      })}
    </ul>
    <footer class="last-item" ref={ref} aria-hidden="true">
      <LastItem max={filteredTokens.value.length} amount={paginatedTokens.value.length}/>
    </footer>
  </nav>
});



const TraitListFilter = component$(() => {
  const {pool} = useContext(PoolContext);
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
      {trait.options.map(({ name }) => <Option key={name} value={name}>{name}</Option>)}
    </Select>
  </FormField>
});


export default component$(() => {
  useStyles$(styles);
  const { pool } = useContext(PoolContext);
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
  
  const focusSearch = $(() => {
    document.querySelector<HTMLElement>('input[type="search"]')?.focus();
  })

  return <main id="pool-page">
    <header id="pool-header">
      <img width={1920} height={450} src="https://i.seadn.io/gae/YPGHP7VAvzy-MCVU67CV85gSW_Di6LWbp-22LGEb3H6Yz9v4wOdAaAhiswnwwL5trMn8tZiJhgbdGuBN9wvpH10d_oGVjVIGM-zW5A?auto=format&dpr=1&w=1920"/>
    </header>
    <section aria-label="Tokens">
      <Form class="token-filters" role="search" initialValue={filter.value} onChange$={v => filter.value = v}>
        <FormField class="outline">
          <Input id="search-token" name="q" type="search" aria-label="search" placeholder="Search"/>
        </FormField>
        <TraitListFilter />
      </Form>
      {/* Bucket before token list to focus before list */}
      <Bucket />
      <TokenList/>
      <div class="go-top tooltip-right" aria-label="Scroll to top">
        <a href="#pool-header" onClick$={focusSearch} class="btn-expand fill">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
          </svg>
        </a>
      </div>
    </section>
  </main>

})


export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: [{ poolId: '1f53a93b-9e8e-41fd-9b90-acfde6e5a6c2' }]
  };
};


export const head: DocumentHead = ({params}) => {
  const pool = poolData;
  return {    
    title: `Souq - ${pool.collectionName}`,
    meta: [
      {
        name: 'description',
        content: `Souq pool for ${pool.collectionName}`,
      },
      {
        name: 'id',
        content: params.poolId,
      },
      {
        name: 'og:title',
        content: `Souq - ${pool.collectionName}`
      },
      {
        name: 'og:description',
        content: `Souq pool for ${pool.collectionName}`,
      },
      {
        name: 'og:image',
        content: "https://i.seadn.io/gae/YPGHP7VAvzy-MCVU67CV85gSW_Di6LWbp-22LGEb3H6Yz9v4wOdAaAhiswnwwL5trMn8tZiJhgbdGuBN9wvpH10d_oGVjVIGM-zW5A?auto=format&dpr=1&w=1200"
      },
    ],
  };
};