import { ethers } from 'ethers';
import { contractToABI } from './util/crypto';

const polygonRPCProvider = ethers.getDefaultProvider(
  //"https://rpc.ankr.com/polygon"
  'https://rpc-mumbai.maticvigil.com',
);

const blockplotContractInstance = new ethers.Contract(
  '0xFE91c0605280B434E0A53e963eb54e3B250188b4',
  contractToABI['blockplot'],
  polygonRPCProvider,
);

export async function getAssetMetadata(tokenId: number) {
  const metadata = await blockplotContractInstance.idToMetadata(
    tokenId.toString(),
  );
  return {
    name: metadata.name,
    symbol: metadata.symbol,
    totalSupply: +ethers.utils.formatUnits(metadata.totalSupply, 'wei'),
    vestingPeriod: +ethers.utils.formatUnits(metadata.vestingPeriod, 'wei'),
    costToDollar: +ethers.utils.formatUnits(metadata.costToDollar, 'wei'),
  };
}

export async function getAssetBalance(tokenId: number, userAddress: string) {
  try {
    const amount = await blockplotContractInstance.balanceOf(
      userAddress,
      tokenId.toString(),
    );
    return +ethers.utils.formatUnits(amount, 'wei');
  } catch (error) {
    return undefined;
  }
}
