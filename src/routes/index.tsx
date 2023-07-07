import { component$, useStyles$ } from '@builder.io/qwik';
import type { DocumentHead} from '@builder.io/qwik-city';
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
        <a href="/pool/1f53a93b-9e8e-41fd-9b90-acfde6e5a6c2">
          <img width={400} height={100} src="https://i.seadn.io/gae/YPGHP7VAvzy-MCVU67CV85gSW_Di6LWbp-22LGEb3H6Yz9v4wOdAaAhiswnwwL5trMn8tZiJhgbdGuBN9wvpH10d_oGVjVIGM-zW5A?auto=format&dpr=1&w=300" />
          <h3>Parallel NFT</h3>
        </a>
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
