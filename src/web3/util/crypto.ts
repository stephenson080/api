import { ethers } from 'ethers';
import { pbkdf2Sync, randomBytes } from 'crypto';
import {blockplot, swap, blockplotViewer, identityABI, initialSale,priceConsumerV3ABI, token} from './abi'
// import tokenABI from './ABIs/IERC20Metadata.json';
// import initialSaleABI from './ABIs/IInitialSale.json';
// import swapABI from './ABIs/ISwapERC1155.json';
// import blockPlotABI from './ABIs/IBlockPlotERC1155.json';

export const contractToABI = {
  token: token,
  initialSale: initialSale,
  swap: swap,
  blockplot: blockplot,
  blockplotViewer,
  priceConsumerV3ABI,
};



// resolves if an address is a valid one.
// Also if its an ENS name, it resolves it to its corresponding address
export async function ENSResolver(ensId: string) {
  try {
    console.log(ensId, 'id');
    if (ethers.utils.isAddress(ensId) == true) {
      return ensId;
    } else if (ensId.slice(-4) == '.eth') {
      const tempProvider = ethers.getDefaultProvider();
      const address = await tempProvider.resolveName(ensId);
      console.log(address);
      return address;
    } else {
      throw new Error('Invalid Address');
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const polygonRPCProvider = ethers.getDefaultProvider(
  "https://rpc.ankr.com/polygon"
  // 'https://rpc-mumbai.maticvigil.com',
);

// returns input data of params parsed into it, if done right
export async function inputDataResolver(
  contract: 'token' | 'initialSale' | 'blockplot' | 'swap',
  functionName: string,
  params: any[],
  contractAddress: string,
) {
  console.log('okay', contractAddress, functionName)
  const contractInterface = new ethers.utils.Interface(contractToABI[contract]);
  if (contract === 'token') {
    if (functionName === 'transfer') {
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractToABI[contract],
        new ethers.VoidSigner(
          '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
          polygonRPCProvider,
        ),
      );
      const amount = ethers.utils.parseUnits(
        params[1],
        await contractInstance.decimals(),
      );
      params[1] = amount
    }
  }
  // if (contract === 'initialSale') {
  //   params = ['0xE1A5Fdaa7986923680CF497c7c1D72525aEFc663', 0, params[1]];
  // }

  // console.log(contractInterface.functions);
  // console.log(contractInterface.functions['approve(address,uint256)'].inputs);
  let data = contractInterface.encodeFunctionData(functionName, params);
  return data;
}

// returns inout data of params parsed into it, if done right

export async function encryption(password: string, newSalt?: string) {
  if (newSalt) {
    const hash = pbkdf2Sync(password, newSalt, 1000, 64, `sha512`).toString(
      'hex',
    );

    return hash;
  }

  // hgenerate random salt
  const salt = randomBytes(16).toString('hex');

  //hash user's password with salt
  const randomHashedPassword = pbkdf2Sync(
    password,
    salt,
    1000,
    64,
    `sha512`,
  ).toString('hex');

  //use salt as password and a predefined string as new salt
  const staticHashedPassword = pbkdf2Sync(
    salt,
    '1234567890abcdef',
    1000,
    64,
    `sha512`,
  ).toString('hex');

  return {
    salt: salt,
    randomHashedPassword: randomHashedPassword,
    staticHashedPassword: staticHashedPassword,
  };
}
