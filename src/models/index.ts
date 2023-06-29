export interface Pool {
  id: string
  accessToken: string
  address: string
  name: string
  capacity: string
  clusters: Cluster[]
  collectionAddress: string
  collectionName: string
  collectionTokens: CollectionToken[]
  collectionType: string
  fee: Fee
  paused: boolean
  stablecoinAddress: string
  stablecoinName: string
  stablecoinDecimals: number
  subPools: SubPool[]
  traits: Traits
  tvl: number
  useAccess: boolean
  volume: number
}

export interface Cluster {
  clusterId: number
  tokens: number[]
}

export interface CollectionToken {
  id: string
  collectionId: string
  tokenId: number
  supply: number
  burnedSupply: number
  uri: string
  metadataId?: string
  clusterId?: number
  createdAt: string
  updatedAt: string
  metadata?: Metadata
}

export interface Metadata {
  id: string
  tokenId: number
  name: string
  description: string
  image: string
  internalImg: string
  externalUrl: string
  attributes: Attribute[]
  createdAt: string
  updatedAt: string
}

export interface Attribute {
  key: string
  value: string
  trait_type: string
}

export interface Fee {
  lpBuyFee: string
  lpSellFee: string
  protocolBuyFee: string
  protocolSellFee: string
  royaltiesBuyFee: string
  royaltiesSellFee: string
}

export interface SubPool {
  id: string
  internalId: number
  poolId: string
  reserve: number
  totalShares: number
  status: boolean
  V: string
  F: number
  shares: Share[]
}

export interface Share {
  id: string
  collectionTokenId: string
  amount: number
  subPoolId: string
  collectionToken: CollectionToken2
}

export interface CollectionToken2 {
  id: string
  collectionId: string
  tokenId: number
  supply: number
  burnedSupply: number
  uri: string
  metadataId: string
  clusterId: number
  createdAt: string
  updatedAt: string
  metadata: Metadata2
  sales: Sale[]
  collection: Collection
}

export interface Metadata2 {
  id: string
  tokenId: number
  name: string
  description: string
  image: string
  internalImg: string
  externalUrl: string
  attributes: Attribute2[]
  createdAt: string
  updatedAt: string
}

export interface Attribute2 {
  key: string
  value: string
  trait_type: string
}

export interface Sale {
  unitPriceUSD: number
}

export interface Collection {
  id: string
  address: string
  chainId: string
  name: string
  symbol: string
  description: any
  uriPrefix: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface Traits {
  State: State
  Rarity: Rarity
  Class: Class
  Artist: Artist
  Parallel: Parallel
}

export interface State {
  name: string
  options: Option[]
  attributes: string[]
}

export interface Option {
  name: string
  value: number
}

export interface Rarity {
  name: string
  options: Option2[]
  attributes: string[]
}

export interface Option2 {
  name: string
  value: number
}

export interface Class {
  name: string
  options: Option3[]
  attributes: string[]
}

export interface Option3 {
  name: string
  value: number
}

export interface Artist {
  name: string
  options: Option4[]
  attributes: string[]
}

export interface Option4 {
  name: string
  value: number
}

export interface Parallel {
  name: string
  options: Option5[]
  attributes: string[]
}

export interface Option5 {
  name: string
  value: number
}
