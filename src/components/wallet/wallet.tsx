import { component$, event$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Modal } from "qwik-hueeye";
import type { ConnectorClient} from "~/hooks/ethereum";
import { useEthereum } from "~/hooks/ethereum";
import styles from './wallet.css?inline';

const supportedChain = 1;
const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const ConnectWallet = component$(() => {
  const { state, connect, findClients, switchChain } = useEthereum();
  const noWalletOpen = useSignal(false);
  const selectWalletOpen = useSignal(false);
  const switchChainOpen = useSignal(false);

  const selectClient = event$(async (client: ConnectorClient) => {
    await connect(client);
    if (!state.chainId) throw new Error('No network found');
    if (supportedChain === state.chainId) return;
    switchChainOpen.value = true;
  })

  const selectWallet = event$(async () => {
    const clients = await findClients();
    if (!clients.length) return noWalletOpen.value = true;
    if (clients.length > 1) return selectWalletOpen.value = true;
    selectClient(clients[0]);
  });

  const selectChain = event$(async () => {
    await switchChain(supportedChain);
    switchChainOpen.value = false;
  });

  return <>
    <button class="btn-outline gradient" onClick$={selectWallet}>
      Connect Wallet
    </button>
    <Modal type="modal" open={selectWalletOpen}>
      <h3>Select a wallet</h3>
      <ul class="action-list client-list modal-content">
        {state.clients.map(client => (
        <li key={client.connectorId}>
          <button onClick$={() => selectClient(client)}>{client.name}</button>
        </li>
        ))}
      </ul>
    </Modal>
    <Modal open={noWalletOpen}>
      <h3>No Wallet found</h3>
      <p class="modal-content">
        You don't have any wallet connector available.<br/>
        We recommand you to install MetaMask.
      </p>
    </Modal>
    <Modal open={switchChainOpen}>
      <h3>Switch chain</h3>
      <p>
        Souq is using the chain {supportedChain}. You'll need to switch your current chain to use Souq.
      </p>
      <p class="modal-content">
        You current chain is {state.chainId}.<br/>
        Switch Chain to {supportedChain}
      </p>
      <footer class="modal-actions">
        <button class="btn" type="reset">Cancel</button>
        <button class="btn-fill primary" onClick$={selectChain}>
          Switch Chain
        </button>
      </footer>
    </Modal>
  </>
});


const WalletNetwork = component$(() => {
  const { state, switchChain } = useEthereum();
  if (state.chainId === supportedChain) return <span>{state.chainId}</span>
  return <button onClick$={() => switchChain(supportedChain)} class="warn">
    {state.chainId}
  </button>
})

export const WalletWidget = component$(() => {
  useStyles$(styles);
  const { state } = useEthereum();
  
  if (!state.account) return <ConnectWallet/>
  return <div class="wallet-widget gradient">
    <WalletNetwork/>
    <button>{shortAddress(state.account)}</button>
  </div>
})