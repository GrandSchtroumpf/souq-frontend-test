import type { ContractRunner, ContractTransaction, Overrides, BigNumberish } from "ethers";
import { BaseContract } from "ethers";
import abi from "./abi.json";

export interface PoolFee {
  lpBuyFee: bigint;
  lpSellFee: bigint;
  royaltiesBuyFee: bigint;
  royaltiesSellFee: bigint;
  protocolBuyRatio: bigint;
  protocolSellRatio: bigint;
  royaltiesBalance: bigint;
  protocolBalance: bigint;
  royaltiesAddress: string;
  protocolFeeAddress: string;
}
export interface LiquidityLimit {
  poolTvlLimit: bigint;
  cooldown: bigint;
  maxDepositPercentage: bigint;
  maxWithdrawPercentage: bigint;
  minFeeMultiplier: bigint;
  maxFeeMultiplier: bigint;
  addLiqMode: number;
  removeLiqMode: number;
  onlyAdminProvisioning: boolean;
}
export interface IterativeLimit {
  minimumF: bigint;
  maxBulkStepSize: number;
  iterations: number;
}
export interface PoolData {
  useAccessToken: boolean;
  accessToken: string;
  poolLPToken: string;
  stable: string;
  tokens: string[];
  stableYieldAddress: string;
  coefficientA: bigint;
  coefficientB: bigint;
  coefficientC: bigint;
  fee: PoolFee;
  liquidityLimit: LiquidityLimit;
  iterativeLimit: IterativeLimit;
}
export interface AMMSubPool1155Details {
  reserve: bigint;
  totalShares: bigint;
  V: bigint;
  F: bigint;
}
export interface FeeReturn {
  totalFee: bigint;
  swapFee: bigint;
  lpFee: bigint;
  royalties: bigint;
  protocolFee: bigint;
}
export interface SharePrice {
  id: bigint;
  value: bigint;
  fees: FeeReturn;
}
export interface Quotation {
  total: bigint;
  fees: FeeReturn;
  shares: SharePrice[];
}

/**
 * MME1155
 */
export class MME1155 extends BaseContract {

  // Read
  addressesRegistry!: (overrides?: Overrides) => Promise<string>;
  factory!: (overrides?: Overrides) => Promise<string>;
  /**
   * Function to get the LP token price
   */
  getLPPrice!: (overrides?: Overrides) => Promise<bigint>;
  /**
   * Function to get the TVL of a specific sub pool
   * @param id The id of the sub pool
   */
  getPool!: (subPoolId: BigNumberish, overrides?: Overrides) => Promise<AMMSubPool1155Details>;
  /**
   * Function to get the quote for swapping shares in buy or sell direction
   * @param amounts The amounts of shares to buy or sell
   * @param buy The directional boolean. If buy direction then true
   * @param tokenIds The shares token ids
   * @param useFee the boolean determining whether to use Fee in the calculation or not in case we want to calculate the value of the shares for liquidity
   */
  getQuote!: (
    amounts: BigNumberish[],
    tokenIds: BigNumberish[],
    buy: boolean,
    useFee: boolean,
    overrides?: Overrides
  ) => Promise<Quotation>;
  /**
   * Function that returns the subpool ids of the given token ids
   * @param tokenIds The address of the pool
   */
  getSubPools!: (tokenIds: BigNumberish[], overrides?: Overrides) => Promise<bigint[]>;
  /**
   * Function that returns the subpool ids of the given sequencial token ids
   * @param endTokenId The end id of the token ids
   * @param startTokenId The start id of the token ids
   */
  getSubPoolsSeq!: (
    startTokenId: BigNumberish,
    endTokenId: BigNumberish,
    overrides?: Overrides
  ) => Promise<bigint[]>;
  /**
   * Function to get the TVL of the pool in stablecoin
   */
  getTVL!: (overrides?: Overrides) => Promise<bigint>;
  /**
   * Function to get amount of a specific token id available in the pool
   * @param tokenId The token id
   */
  getTokenIdAvailable!: (tokenId: BigNumberish, overrides?: Overrides) => Promise<bigint>;
  /**
   * Returns the address of the current owner.
   */
  owner!: (overrides?: Overrides) => Promise<string>;
  /**
   * Returns true if the contract is paused, and false otherwise.
   */
  paused!: (overrides?: Overrides) => Promise<boolean>;
  poolData!: (
    overrides?: Overrides
  ) => Promise<
    [boolean, string, string, string, string, bigint, bigint, bigint, PoolFee, LiquidityLimit, IterativeLimit]
  >;
  queuedWithdrawals!: (overrides?: Overrides) => Promise<[bigint, bigint]>;
  subPools!: (
    arg: BigNumberish,
    overrides?: Overrides
  ) => Promise<[bigint, bigint, boolean, bigint, bigint]>;
  tokenDistribution!: (arg: BigNumberish, overrides?: Overrides) => Promise<bigint>;
  yieldReserve!: (overrides?: Overrides) => Promise<bigint>;

  // Write
  /**
   * Function to rescue and send ERC20 tokens (different than the tokens used by the pool) to a receiver called by the admin
   * @param amount The amount of tokens
   * @param receiver The address of the receiver
   * @param token The address of the token contract
   */
  RescueTokens!: (
    token: string,
    amount: BigNumberish,
    receiver: string,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to withdraw fees by a caller that is either the royalties or protocol address
   * @param amount The amount to withdraw
   * @param feeType The type of the fees to withdraw
   * @param to The address to send the funds to
   */
  WithdrawFees!: (
    to: string,
    amount: BigNumberish,
    feeType: number,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to add liquidity using shares
   * @param maxAmounts The maximum amounts of shares to be spent
   * @param targetLP The amount of required LPs outputted
   * @param tokenIds The token ids of shares to be spent
   */
  addLiquidityShares!: (
    tokenIds: BigNumberish[],
    amounts: BigNumberish[],
    targetLP: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to add liquidity using Stable coins
   * @param _maxStable The amount of maximum stablecoins to be spent
   * @param targetLP The amount of target LPs outputted
   */
  addLiquidityStable!: (
    targetLP: BigNumberish,
    maxStable: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to add a new sub pool
   * @param f The initial F value of the sub pool
   * @param v The initial V value of the sub pool
   */
  addSubPool!: (v: BigNumberish, f: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Function to move enable or disable specific subpools by ids
   * @param _newStatus The new status, enabled=true or disabled=false
   * @param subPoolIds The sub pools ids array
   */
  changeSubPoolStatus!: (
    subPoolIds: BigNumberish[],
    newStatus: boolean,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function that deposits the initial liquidity to specific subpool
   * @param amounts The amounts array of the shares to deposit
   * @param stableIn The stablecoins amount to deposit
   * @param subPoolId The sub pool id
   * @param tokenIds The token ids array of the shares to deposit
   */
  depositInitial!: (
    tokenIds: BigNumberish[],
    amounts: BigNumberish[],
    stableIn: BigNumberish,
    subPoolId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to deposit stablecoins from the pool to a yield generating protocol and getting synthetic tokens
   * @param amount The amount of stablecoins
   */
  depositIntoStableYield!: (amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  initialize!: (
    _poolData: PoolData,
    symbol: string,
    name: string,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to move reserves between subpools
   * @param amount The amount to move
   * @param movedId The id of the sub pool that will move the funds to
   * @param moverId The sub pool that will move the funds from
   */
  moveReserve!: (
    moverId: BigNumberish,
    movedId: BigNumberish,
    amount: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to move shares sequencially to a different sub pool called by the admin
   * @param endId The end index of the token ids to be moved
   * @param newSubPoolId The id of the new subpool
   * @param startId The start index of the token ids to be moved
   */
  moveShares!: (
    startId: BigNumberish,
    endId: BigNumberish,
    newSubPoolId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to move shares in an array list to a different sub pool called by the admin
   * @param ids The array of shares ids to be moved
   * @param newSubPoolId The id of the new subpool
   */
  moveSharesList!: (
    newSubPoolIds: BigNumberish,
    ids: BigNumberish[],
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to pause
   */
  pause!: (overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Function to process all queued transactions upto limit
   * @param limit The number of transactions to process
   */
  processWithdrawals!: (limit: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Function to remove liquidity by shares
   * @param maxAmounts The maximum amounts of shares to be outputted
   * @param targetLP The amount of LPs to be burned
   * @param tokenIds The token ids of shares to be outputted
   */
  removeLiquidityShares!: (
    targetLP: BigNumberish,
    tokenIds: BigNumberish[],
    amounts: BigNumberish[],
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to remove liquidity by stable coins
   * @param targetLP The amount of LPs to be burned
   */
  removeLiquidityStable!: (targetLP: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.
   */
  renounceOwnership!: (overrides?: Overrides) => Promise<ContractTransaction>;
  setFee!: (newFee: PoolFee, overrides?: Overrides) => Promise<ContractTransaction>;
  setPoolData!: (newPoolData: PoolData, overrides?: Overrides) => Promise<ContractTransaction>;
  setPoolIterativeLimits!: (newLimits: IterativeLimit, overrides?: Overrides) => Promise<ContractTransaction>;
  setPoolLiquidityLimits!: (newLimits: LiquidityLimit, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Function to swap shares to stablecoins
   * @param amounts The amounts of token ids outputted
   * @param minStable The minimum stablecoin to receive
   * @param tokenIds The token ids outputted
   */
  swapShares!: (
    amounts: BigNumberish[],
    tokenIds: BigNumberish[],
    minStable: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to swap stablecoins to shares
   * @param amounts The amounts of token ids outputted
   * @param maxStable The maximum amount of stablecoin to be spent
   * @param tokenIds The token ids outputted
   */
  swapStable!: (
    requiredAmounts: BigNumberish[],
    tokenIds: BigNumberish[],
    maxStable: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
   */
  transferOwnership!: (newOwner: string, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Function to unpause
   */
  unpause!: (overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Function to update the v of several subpools
   * @param subPoolIds The sub pools array
   * @param vArray The v array
   */
  updatePoolV!: (
    subPoolIds: BigNumberish[],
    vArray: BigNumberish[],
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Function to withdraw stablecoins from the pool to a yield generating protocol using the synthetic tokens
   * @param amount The amount of stablecoins to withdraw
   */
  withdrawFromStableYield!: (amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;

  constructor(provider: ContractRunner) {
    super('0x72f2A9e83c31686b7803AA1b9B822521901DaEa4', abi, provider);
  }
}
