import type { NoSerialize } from "@builder.io/qwik";
import { $, noSerialize } from "@builder.io/qwik";
import { BrowserProvider } from "ethers";
import type {  ConnectorClient, EthereumState } from "../ethereum";
import { getChain, toChainHex, toChainId, toEIP3085Chain } from "./utils";

interface InjectedProviders {
  isApexWallet?: true;
  isAvalanche?: true;
  isBackpack?: true;
  isBifrost?: true;
  isBitKeep?: true;
  isBitski?: true;
  isBlockWallet?: true;
  isBraveWallet?: true;
  isCoinbaseWallet?: true;
  isDawn?: true;
  isEnkrypt?: true;
  isExodus?: true;
  isFrame?: true;
  isFrontier?: true;
  isGamestop?: true;
  isHyperPay?: true;
  isImToken?: true;
  isKuCoinWallet?: true;
  isMathWallet?: true;
  isMetaMask?: true;
  isOkxWallet?: true;
  isOKExWallet?: true;
  isOneInchAndroidWallet?: true;
  isOneInchIOSWallet?: true;
  isOpera?: true;
  isPhantom?: true;
  isPortal?: true;
  isRabby?: true;
  isRainbow?: true;
  isStatus?: true;
  isTally?: true;
  isTokenPocket?: true;
  isTokenary?: true;
  isTrust?: true;
  isTrustWallet?: true;
  isXDEFI?: true;
  isZerion?: true;
  isHaloWallet?: true;
  /** Only exists in MetaMask as of 2022/04/03 */
  _events: {
    connect?: () => void
  }
  /** Only exists in MetaMask as of 2022/04/03 */
  _state?: {
    accounts?: string[]
    initialized?: boolean
    isConnected?: boolean
    isPermanentlyDisconnected?: boolean
    isUnlocked?: boolean
  }
  selectedAddress?: string;
  chainId: string;

  on(event: string, handler: (...params: any[]) => void): void;
  removeListener(event: string, handler: (...params: any[]) => void): void;
  request(params: { method: string, params?: any[] }): Promise<any>
}

export interface WindowProvider extends InjectedProviders {
  providers?: WindowProvider[]
}


const getInjectedName = (injected: InjectedProviders) => {
  if (injected.isApexWallet) return 'Apex Wallet'
  if (injected.isAvalanche) return 'Core Wallet'
  if (injected.isBackpack) return 'Backpack'
  if (injected.isBifrost) return 'Bifrost Wallet'
  if (injected.isBitKeep) return 'BitKeep'
  if (injected.isBitski) return 'Bitski'
  if (injected.isBlockWallet) return 'BlockWallet'
  if (injected.isBraveWallet) return 'Brave Wallet'
  if (injected.isCoinbaseWallet) return 'Coinbase Wallet'
  if (injected.isDawn) return 'Dawn Wallet'
  if (injected.isEnkrypt) return 'Enkrypt'
  if (injected.isExodus) return 'Exodus'
  if (injected.isFrame) return 'Frame'
  if (injected.isFrontier) return 'Frontier Wallet'
  if (injected.isGamestop) return 'GameStop Wallet'
  if (injected.isHyperPay) return 'HyperPay Wallet'
  if (injected.isImToken) return 'ImToken'
  if (injected.isHaloWallet) return 'Halo Wallet'
  if (injected.isKuCoinWallet) return 'KuCoin Wallet'
  if (injected.isMathWallet) return 'MathWallet'
  if (injected.isOkxWallet || injected.isOKExWallet) return 'OKX Wallet'
  if (injected.isOneInchIOSWallet) return '1inch Wallet'
  if (injected.isOneInchAndroidWallet) return '1inch Wallet'
  if (injected.isOpera) return 'Opera'
  if (injected.isPhantom) return 'Phantom'
  if (injected.isPortal) return 'Ripio Portal'
  if (injected.isRabby) return 'Rabby'
  if (injected.isRainbow) return 'Rainbow'
  if (injected.isStatus) return 'Status'
  if (injected.isTally) return 'Taho'
  if (injected.isTokenPocket) return 'TokenPocket'
  if (injected.isTokenary) return 'Tokenary'
  if (injected.isTrust) return 'Trust Wallet'
  if (injected.isTrustWallet) return 'Trust Wallet'
  if (injected.isXDEFI) return 'XDEFI Wallet'
  if (injected.isZerion) return 'Zerion'
  if (injected.isMetaMask) return 'MetaMask'
  return 'Injected';
}




export function injected() {
  const state: {
    provider?: NoSerialize<WindowProvider>,
    ethereum?: EthereumState
  } = {};
  const connectorId = 'injected';

  const getProvider = $((name?: string) => {
    if (!state.provider) {
      if (!('ethereum' in window)) throw new Error('No injected providers');
      const injected = window.ethereum as WindowProvider;
      if (!injected.providers?.length) {
        state.provider = noSerialize(injected);
      } else {
        state.provider = noSerialize(injected.providers.find(p => getInjectedName(p) === name));
      }
    }
    return state.provider;
  });

  const onAccountsChanged = $(([account]: string[]) => {
    if (!state.ethereum) return;
    state.ethereum.account = account;
  });
  const onChainChanged = $((chainHex: string) => {
    if (!state.ethereum) return;
    state.ethereum.chainId = toChainId(chainHex);
  });

  const onDisconnect = $(() => {
    if (!state.ethereum) return;
    state.ethereum.account = undefined;
    state.ethereum.chainId = undefined;
    state.ethereum.client = undefined;
    state.ethereum.status = 'disconnected';
  });
  
  const addListeners = $(async () => {
    const provider = await getProvider();
    if (!provider) return;
    provider.on('accountsChanged', onAccountsChanged);
    provider.on('chainChanged', onChainChanged);
    provider.on('disconnect', onDisconnect);
  });

  const removeListeners = $(async () => {
    const provider = await getProvider();
    if (!provider) return;
    provider.removeListener('accountsChanged', onAccountsChanged)
    provider.removeListener('chainChanged', onChainChanged)
    provider.removeListener('disconnect', onDisconnect)
  })

  const getClients = $((): ConnectorClient[] => {
    if (!('ethereum' in window)) return [];
    const injected = window.ethereum as WindowProvider;
    if (!injected.providers?.length) return [{ name: getInjectedName(injected), connectorId }];
    const nameSet = new Set<string>();
    for (const provider of injected.providers) {
      nameSet.add(getInjectedName(provider));
    }
    return Array.from(nameSet).map(name => ({ name, connectorId }));
  });

  const connect = $(async (client?: ConnectorClient) => {
    const provider = await getProvider(client?.name);
    if (!provider) throw new Error('No provider found');
    const [account] = await provider.request({  method: 'eth_requestAccounts' });
    addListeners();
    new Promise(() => {
      localStorage.setItem('wallet', JSON.stringify({...client, account}));
    });
    return {
      account,
      chainId: toChainId(provider.chainId),
      provider: new BrowserProvider(provider)
    };
  });

  const disconnect = $(() => {
    if (!state.ethereum) return;
    state.ethereum.account = undefined;
    state.ethereum.chainId = undefined;
    state.ethereum.client = undefined;
    state.ethereum.status = 'disconnected';
    removeListeners();
  });

  const addChain = $(async (chainId: number | string) => {
    const provider = await getProvider();
    if (!provider) throw new Error('No Provider found');
    const chain = await getChain(chainId);
    return provider.request({
      method: 'wallet_addEthereumChain',
      params: [toEIP3085Chain(chain)]
    });
  });

  const switchChain = $(async (chainId: string | number) => {
    const provider = await getProvider();
    if (!provider) throw new Error('No Provider found');
    return provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: toChainHex(chainId) }]
    })
    .catch(async (err: any) => {
      console.log('An error occurred', err)
      if (err.code === 4902) {
        await addChain(chainId);
      } else {
        throw err;
      }
    });
  });

  const register = $((service: EthereumState) => {
    state.ethereum = service;
  })


  return {
    id: connectorId,
    connect,
    disconnect,
    getClients,
    switchChain,
    addChain,
    register
  };
}