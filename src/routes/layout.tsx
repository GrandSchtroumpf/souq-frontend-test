import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { Logo } from '~/components/logo';
import styles from './layout.css?inline';


export default component$(() => {
  useStyles$(styles);
  return <>
    <header id="banner">
      <a class="logo" href="/">
        <Logo/>
      </a>
      <nav aria-label="Primary">
        <a class="btn" href="/vaults">Vaults</a>
        <a class="btn" href="/pool/1f53a93b-9e8e-41fd-9b90-acfde6e5a6c2">Pools</a>
      </nav>
      <button class="btn-outline gradient">
        Connect Wallet
      </button>
    </header>
    <Slot />
    <footer>

    </footer>
  </>
});
