import { Contract } from "ethers";
import MME1155Abi from './abi/MME1155.json';

const contracts: Record<string, Contract> = {};


export const getContract = <T extends Contract = Contract>(address: string): T => {
  // Change provider on provider changes
  contracts[address] ||= new Contract(address, MME1155Abi);
  return contracts[address] as T;
}