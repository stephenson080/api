import { ethers } from 'ethers';
import {addresses, identityABI} from './util/abi'

const polygonRPCProvider = ethers.getDefaultProvider(
  //"https://rpc.ankr.com/polygon"
  'https://rpc-mumbai.maticvigil.com',
);

const blockplotContractInstance = new ethers.Contract(
    addresses.identity,
    identityABI,
    polygonRPCProvider,
);

// async function verifyUserWalletAddress(wallet: )