import { $, createContextId, noSerialize, useContext, useContextProvider, useStore, useVisibleTask$ } from '@builder.io/qwik';
import type { QRL, NoSerialize} from '@builder.io/qwik';
import type { AbstractProvider} from 'ethers';
import { BrowserProvider, getDefaultProvider } from 'ethers';

export interface EthereumState {
  provider?: NoSerialize<AbstractProvider | BrowserProvider>;
  clients: ConnectorClient[];
  client?: ConnectorClient;
  account?: string;
  chainId?: number;
  status: "connecting" | "connected" | "disconnected";
  error?: Error;
}


export type EthereumService = ReturnType<typeof useEthereumProvider>;
export const EthereumContext = createContextId<EthereumService>('EthereumContext');


export interface ConnectorClient {
  connectorId: string;
  name: string;
}

export interface ConnectOutput {
  chainId: number;
  account: `0x${string}`;
  provider: BrowserProvider;
} 

interface Connector {
  id: string;
  register: QRL<(ethereum: EthereumState) => any>;
  getClients: QRL<() => ConnectorClient[]>;
  connect: QRL<(client?: ConnectorClient) => Promise<ConnectOutput>>;
  disconnect: QRL<() => any>;
  switchChain: QRL<(chainId: string | number) => any>
}

interface EthereumProps {
  chainId: number;
  connectors: Connector[];
}


export function useEthereumProvider(props: EthereumProps) {
  const state = useStore<EthereumState>({
    status: 'disconnected',
    clients: [],
    chainId: props.chainId,
    provider: noSerialize(getDefaultProvider('https://eth.llamarpc.com'))
  }, { deep: false });

  const findClients = $(async () => {
    if (state.clients.length) return state.clients;
    props.connectors.forEach(connector => connector.register(state));
    const getAll = props.connectors.map(c => c.getClients());
    state.clients = await Promise.all(getAll).then(all => all.flat());
    return state.clients;
  })

  
  const getConnector = $(async (client?: ConnectorClient) => {
    if (!state.clients.length) await findClients();
    return client
      ? props.connectors.find(c => c.id === client.connectorId)
      : props.connectors[0];
  })
  

  const connect = $(async (client?: ConnectorClient) => {
    if (state.client) return;
    state.status = 'connecting';
    try {
      const connector = await getConnector(client);
      if (!connector) throw new Error(`No connector found`);
      const data = await connector.connect(client);
      state.account = data.account;
      state.chainId = data.chainId;
      state.provider = noSerialize(data.provider);
      state.client = client;
      state.status = 'connected';
      new Promise(() => {
        localStorage.setItem('wallet', JSON.stringify({...client, account: data.account }));
      });
    }
    catch(err) {
      console.log(err);
      state.status = state.client ? 'connected' : 'disconnected';
      throw err;
    }
  });

  const disconnect = $(async () => {
    const client = state.client;
    if (!client) return;
    const connector = await getConnector(client);
    await connector?.disconnect();
    state.status = 'disconnected';
  });

  const switchChain = $(async (chainId: number) => {
    if (!state.client) await connect();
    const connector = await getConnector();
    return connector?.switchChain(chainId);
  });

  const getProvider = $(() => {
    if (!state.provider) {
      service.state.provider = noSerialize(getDefaultProvider('https://eth.llamarpc.com'))
    }
    return state.provider!;
  })

  const getSigner = $(async () => {
    if (!(state.provider instanceof BrowserProvider)) {
      await connect();
    }
    if (!(state.provider instanceof BrowserProvider)) throw new Error('You need to be connected');
    return state.provider.getSigner();
  })

  const service = { state, findClients, connect, disconnect, switchChain, getProvider, getSigner };
  useContextProvider(EthereumContext, service);
  return service;
}

export const useEthereum = () => {
  const service = useContext(EthereumContext);
  useVisibleTask$(() => {
    const wallet = sessionStorage.getItem('wallet');
    if (wallet) service.connect(JSON.parse(wallet));
  });
  return service;
}