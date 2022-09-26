import { ethers } from 'ethers';
import { pbkdf2Sync, randomBytes } from 'crypto';

// resolves if an address is a valid one.
// Also if its an ENS name, it resolves it to its corresponding address
export async function ENSResolver(ensId: string) {
  try {
    if (ethers.utils.isAddress(ensId) == true) {
      return ensId;
    } else if (ensId.slice(-4) == '.eth') {
      const tempProvider = ethers.getDefaultProvider();
      return await tempProvider.resolveName(ensId);
    } else {
      throw new Error('Invalid Address');
    }
  } catch (err) {
    throw err;
  }
}

// returns inout data of params parsed into it, if done right
export async function inputDataResolver(
  abi: string,
  paramTypes: (ethers.utils.ParamType | string)[],
  params: any[],
) {
  const data =
    ethers.utils.id(abi).substring(0, 10) +
    ethers.utils.defaultAbiCoder.encode(paramTypes, params).slice(2);
  console.log(data);
  return data;
}

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
