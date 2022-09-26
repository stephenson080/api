import { ethers } from 'ethers';
import { encryption } from './util/crypto';

const polygonRPCProvider = ethers.getDefaultProvider(
  //"https://rpc.ankr.com/polygon"
  'https://rpc-mumbai.maticvigil.com',
);

// const encryption = () => {

// }

export class Web3Wallet {
  constructor(
    public address: string,
    public signer: ethers.Signer,
    public passwordEncryptedWallet: string,
    public staticEncryptedWallet: string,
    public salt: string,
  ) {}
  static async reEncrypt(newPassword: string, salt: string, wallet: ethers.Wallet) {
    try {
      const result = await encryption(newPassword, salt);
      if (typeof result === 'object') {
        throw new Error('Error resetting wallet');
      }
      return await wallet.encrypt(newPassword)
    } catch (error) {
        throw error
    }
  }
  static async createWallet(password: string) {
    try {
      const result = await encryption(password);
      if (typeof result === 'string') {
        throw new Error('Error creating wallet');
      }
      const createdWallet = ethers.Wallet.createRandom();

      const randomEncryptedWallet = await createdWallet.encrypt(
        result.randomHashedPassword,
      );
      const staticEncryptedWallet = await createdWallet.encrypt(
        result.staticHashedPassword,
      );

      const signer = createdWallet.connect(polygonRPCProvider);

      return new Web3Wallet(
        createdWallet.address,
        signer,
        randomEncryptedWallet,
        staticEncryptedWallet,
        result.salt,
      );
    } catch (error) {
      throw error;
    }
  }

  static async ImportWalletFromMnemonic(_mnemonic: string, password: string) {
    try {
      const result = await encryption(password);
      if (typeof result === 'string') {
        throw new Error('Error importing wallet');
      }
      const importedWallet = ethers.Wallet.fromMnemonic(_mnemonic);
      const signer = importedWallet.connect(polygonRPCProvider);
      const randomEncryptedWallet = await importedWallet.encrypt(
        result.randomHashedPassword,
      );
      const staticEncryptedWallet = await importedWallet.encrypt(
        result.staticHashedPassword,
      );
      return new Web3Wallet(
        importedWallet.address,
        signer,
        randomEncryptedWallet,
        staticEncryptedWallet,
        result.salt,
      );
    } catch (error) {
      throw error;
    }
  }
  static async ImportWalletFromPrivateKey(
    _privateKey: string,
    password: string,
  ) {
    try {
      const result = await encryption(password);
      if (typeof result === 'string') {
        throw new Error('Error Importing wallet');
      }
      const importedWallet = new ethers.Wallet(_privateKey, polygonRPCProvider);
      const signer = importedWallet.connect(polygonRPCProvider);
      const randomEncryptedWallet = await importedWallet.encrypt(
        result.randomHashedPassword,
      );
      const staticEncryptedWallet = await importedWallet.encrypt(
        result.staticHashedPassword,
      );
      return new Web3Wallet(
        importedWallet.address,
        signer,
        randomEncryptedWallet,
        staticEncryptedWallet,
        result.salt,
      );
    } catch (error) {
      throw error;
    }
  }

  static async decryptWallet(
    password: string,
    encryptedWalletJson: string,
    salt: string,
  ) {
    try {
      const result = await encryption(password, salt);
      if (typeof result === 'object') {
        throw new Error('Error decrypting wallet');
      }
      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
        encryptedWalletJson,
        result,
      );
      return decryptedWallet;
    } catch (error) {
      throw error;
    }
  }

  static async resetWalletWithsalt(
    staticEncryptedWallet: string,
    salt: string,
    newPassword: string
  ) {
    try {
      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
        staticEncryptedWallet,
        salt,
      );
      return await this.reEncrypt(newPassword, salt, decryptedWallet)
    } catch (error) {
      throw error;
    }
  }
}
