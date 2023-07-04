import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { Logo } from '~/components/logo';
import { useEthereumProvider } from '~/hooks/ethereum';
import { injected } from '~/hooks/ethereum/connectors/injected';
import { WalletWidget } from '~/components/wallet/wallet';
import { Link } from '@builder.io/qwik-city';
import styles from './layout.css?inline';


export default component$(() => {
  useStyles$(styles);
  useEthereumProvider({ chainId: 1, connectors: [injected()]});
  return <>
    <header id="banner">
      <a class="logo" href="/">
        <Logo/>
      </a>
      <nav aria-label="Primary">
        <Link class="btn" href="/vaults">Vaults</Link>
        <Link class="btn" href="/pool/1f53a93b-9e8e-41fd-9b90-acfde6e5a6c2">Pools</Link>
      </nav>
      <WalletWidget/>
    </header>
    <Slot />
    <footer>

    </footer>
  </>
});
