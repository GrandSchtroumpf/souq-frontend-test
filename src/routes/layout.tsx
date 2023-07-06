import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { Logo } from '~/components/logo';
import { useEthereumProvider } from '~/hooks/ethereum';
import { injected } from '~/hooks/ethereum/connectors/injected';
import { WalletWidget } from '~/components/wallet/wallet';
import styles from './layout.css?inline';

export default component$(() => {
  useStyles$(styles);
  useEthereumProvider({ chainId: 1, connectors: [injected()]});

  return <>
    <header id="banner">
      <a class="logo" href="/">
        <Logo/>
      </a>
      <WalletWidget/>
    </header>
    <Slot />
    <footer>

    </footer>
  </>
});
