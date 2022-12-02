import { ethers } from 'ethers';
import {addresses, blockplot} from './util/abi'
import {provider} from './util/constants'


const blockplotContractInstance = new ethers.Contract(
  addresses.blockplot,
  blockplot,
  provider,
);

export async function getAssetMetadata(tokenId: number) {
  try {
    const metadata = await blockplotContractInstance.idToMetadata(
      tokenId.toString(),
    );
    return {
      name: metadata.name,
      symbol: metadata.symbol,
      totalSupply: +ethers.utils.formatEther(metadata.totalSupply),
      vestingPeriod: +ethers.utils.formatUnits(metadata.vestingPeriod, 'wei'),
      costToDollar: +ethers.utils.formatUnits(metadata.costToDollar, 'wei'),
      assetId: +ethers.utils.formatUnits(metadata.assetId, 'wei'),
      assetIssuer: metadata.assetIssuer,
      initialSalePeriod: +ethers.utils.formatEther(metadata.initialSalePeriod)
    };
  } catch (error) {
    console.log(error)
  }
  
}

export async function getAssetBalance(tokenId: number, userAddress: string) {
  try {
    const amount = await blockplotContractInstance.balanceOf(
      userAddress,
      tokenId.toString(),
    );
    return +ethers.utils.formatUnits(amount, 'wei');
  } catch (error) {
    return;
  }
}
