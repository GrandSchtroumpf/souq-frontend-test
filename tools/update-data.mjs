import { promises as fs } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { getDefaultProvider, Contract } from 'ethers';

async function getPrices(contract, tokenIds) {
  const amounts = new Array(tokenIds.length).fill(1);
  const quotation = await contract.getQuote(amounts, tokenIds, true, false);
  
  const prices = {};
  for (const share of quotation.shares) {
    prices[share.id.toString()] = Number(share.value) / 1_000_000;
  }

  return prices;
}

async function getSupplies(contract, tokenIds) {
  const supplies = {};
  const getAllSupply = tokenIds.map(async id => {
    const supply = await contract.getTokenIdAvailable(id);
    supplies[id] = Number(supply);
  })
  await Promise.all(getAllSupply);
  return supplies;
}

async function main() {
  const dataFile = join(cwd(), 'src/DATA/tokens.json');
  const file = await fs.readFile(dataFile, 'utf-8');
  const abi = await fs.readFile(join(cwd(), 'src/hooks/ethereum/contracts/MME1155/abi.json'), 'utf-8');
  const tokens = JSON.parse(file);
  const tokenIds = Object.values(tokens).map(token => token.metadata.tokenId);
  
  const provider = getDefaultProvider('https://eth.llamarpc.com');
  const contract = new Contract('0x72f2A9e83c31686b7803AA1b9B822521901DaEa4', JSON.parse(abi), provider);

  const [prices, supplies] = await Promise.all([
    getPrices(contract, tokenIds),
    getSupplies(contract, tokenIds),
  ]);

  for (const [id, token] of Object.entries(tokens)) {
    const tokenId = token.metadata.tokenId;
    tokens[id].sales = [{ unitPriceUSD: prices[tokenId] }];
    tokens[id].supply = supplies[tokenId];
  }

  fs.writeFile(dataFile, JSON.stringify(tokens))
}

main();