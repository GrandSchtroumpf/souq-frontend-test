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
  shares: SharePrice;
}
