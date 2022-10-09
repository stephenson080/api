import { ethers } from 'ethers';
import { encryption, inputDataResolver, ENSResolver } from './util/crypto';
import {Axios} from 'axios'

const axios = new Axios({})

// console.log(axios)

const polygonRPCProvider = ethers.getDefaultProvider(
  //"https://rpc.ankr.com/polygon"
  'https://rpc-mumbai.maticvigil.com',
);

// const encryption = () => {

// }

export class Web3Wallet {
  constructor(
    public address: string,
    public passwordEncryptedWallet: string,
    public staticEncryptedWallet: string,
    public salt: string,
  ) {}
  static async reEncrypt(
    newPassword: string,
    salt: string,
    wallet: ethers.Wallet,
  ) {
    try {
      const result = await encryption(newPassword, salt);
      if (typeof result === 'object') {
        throw new Error('Error resetting wallet');
      }
      return await wallet.encrypt(newPassword);
    } catch (error) {
      throw error;
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


      return new Web3Wallet(
        createdWallet.address,
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
      const randomEncryptedWallet = await importedWallet.encrypt(
        result.randomHashedPassword,
      );
      const staticEncryptedWallet = await importedWallet.encrypt(
        result.staticHashedPassword,
      );
      return new Web3Wallet(
        importedWallet.address,
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
      const randomEncryptedWallet = await importedWallet.encrypt(
        result.randomHashedPassword,
      );
      const staticEncryptedWallet = await importedWallet.encrypt(
        result.staticHashedPassword,
      );
      return new Web3Wallet(
        importedWallet.address,
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
    newPassword: string,
  ) {
    try {
      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
        staticEncryptedWallet,
        salt,
      );
      return await this.reEncrypt(newPassword, salt, decryptedWallet);
    } catch (error) {
      throw error;
    }
  }

  static async sendTransaction(
    walletInstance: ethers.Wallet,
    params: any[],
    contract: 'token' | 'initialSale' | 'blockplot' | 'swap',
    contractFunction: string,
    contractAddress: string,
    value?: string
  ) {

    const wallet = walletInstance.connect(polygonRPCProvider);

    const nonce = await wallet.getTransactionCount();


    // to = await ENSResolver(to);

    // console.log(to)
    // console.log(params.contractAddress)

    const data = await inputDataResolver(contract, contractFunction, params, contractAddress);
    console.log(data)

    let type2TxInfo = await axios.get(
      'https://gasstation-mumbai.matic.today/v2',
    );
    //let type2TxInfo = await axios.get("https://gasstation-mainnet.matic.network/v2");
    const type2TxInfoObj = JSON.parse(type2TxInfo.data)
    let feeData = await wallet.getFeeData();

    let gasPrice = feeData.gasPrice;

    console.log(params)

    const gasEstimate = await wallet.estimateGas({
      to: contractAddress,
      data: data,
      value: value,
    });

    const maticTxFee = gasEstimate.mul(gasPrice);

    try {
      // console.log(
      //   'You are about to send ' +
      //     params +
      //     ' ' +
      //     ' to ' +
      //     to +
      //     '. This transaction will cost a fee of ' +
      //     ethers.utils.formatEther(maticTxFee) +
      //     ' MATIC' +
      //     ', Do you wish to proceed?',
      // );

      // const token = new ethers.Contract(to, abi, wallet);
      // await token.transfer(wallet.address, 100000);

      const rawTransaction = {
        type: 2,
        to: contractAddress,
        data: data,
        value: value,
        nonce: nonce,
        maxFeePerGas: ethers.utils.parseUnits(
          `${Math.ceil(type2TxInfoObj.fast.maxFee)}`,
          'gwei',
        ),
        maxPriorityFeePerGas: ethers.utils.parseUnits(
          `${Math.ceil(type2TxInfoObj.fast.maxPriorityFee)}`,
          'gwei',
        ),
        gasLimit: gasEstimate,
        chainId: polygonRPCProvider._network.chainId,
      };

      console.log('chain id: ' + polygonRPCProvider._network.chainId);
      console.log('Processing');
      const transaction = await wallet.sendTransaction(rawTransaction);
      console.log('Pending Confirmation...');

      await transaction.wait(1);
      console.log('Successful! Transaction Hash: ' + transaction.hash);
      console.log('Success');
      console.log(transaction);
      console.log(
        `Link to tx on polygonscan: https://mumbai.polygonscan.com/tx/${transaction.hash}`,
      );
      return transaction;
    } catch (err) {
      throw err
    }
  }
}
