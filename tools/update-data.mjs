import { promises as fs } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { getDefaultProvider, Contract } from 'ethers';

async function main() {
  const dataFile = join(cwd(), 'src/DATA.json');
  const file = await fs.readFile(dataFile, 'utf-8');
  const abi = await fs.readFile(join(cwd(), 'src/hooks/ethereum/contracts/MME1155/abi.json'), 'utf-8');
  const data = JSON.parse(file);
  const tokenIds = data.subPools.map(subpool => subpool.shares.map(share => share.collectionToken.tokenId)).flat();
  
  const provider = getDefaultProvider('https://eth.llamarpc.com');
  const contract = new Contract('0x72f2A9e83c31686b7803AA1b9B822521901DaEa4', JSON.parse(abi), provider);
  const amounts = new Array(tokenIds.length).fill(1);
  const quotation = await contract.getQuote(amounts, tokenIds, true, false);
  
  const prices = {};
  for (const share of quotation.shares) {
    prices[share.id.toString()] = Number(share.value) / 1_000_000;
  }

  for (const subpool of data.subPools) {
    if (!subpool.status) continue;
    for (const share of subpool.shares) {
      const id = share.collectionToken.tokenId;
      share.collectionToken.sales = [{ unitPriceUSD: prices[id] }];
    }
  }
  fs.writeFile(dataFile, JSON.stringify(data))
}

main();