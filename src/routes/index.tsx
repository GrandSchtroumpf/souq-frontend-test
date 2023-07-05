import { component$, useStyles$ } from '@builder.io/qwik';
import type { DocumentHead} from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return (
    <main id="home">
      <section aria-labelledby="title">
        <h1 id="title">Souq Frontend Test</h1>
        <p>
          This is an unofficial Frontend for Souq. I'm just building this for fun. Please don't use it to buy any asset.
        </p>
      </section>
      <nav aria-label="Pool list">
        <Link href="/pool/1f53a93b-9e8e-41fd-9b90-acfde6e5a6c2" class="surface">Parallel NFT</Link>
      </nav>
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Souq Pools',
  meta: [
    {
      name: 'description',
      content: 'Example of a frontend dapp for Souq AMM',
    },
  ],
};
