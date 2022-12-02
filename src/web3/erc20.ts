import { ethers } from 'ethers';
import { token } from './util/abi';
import { provider } from './util/constants';



export async function initializeERC20(contractAddress: string) {
    const ERC20Read = new ethers.Contract(
        contractAddress,
        token,
        new ethers.VoidSigner(
            '0x6D883CECf8efBff3d490599c9dbcDaBb40008f40',
            provider
        )
    );
    return ERC20Read;
}

// export async function allowance (approver: string, approvee : string) {

// }

export async function balanceOf(tokenAddress: string, userAddress: string) {
    const ERC20Read = await initializeERC20(tokenAddress);
    const _balanceOf = await ERC20Read.balanceOf(userAddress);
    return _balanceOf;
}

export async function name(tokenAddress: string, userAddress: string) {
    const ERC20Read = await initializeERC20(tokenAddress);
    const _name = await ERC20Read.name();
    return _name;
}

export async function decimals(tokenAddress: string, userAddress: string) {
    const ERC20Read = await initializeERC20(tokenAddress);
    const _decimals = await ERC20Read.decimals();
    return _decimals;
}

export async function symbol(tokenAddress: string, userAddress: string) {
    const ERC20Read = await initializeERC20(tokenAddress);
    const _symbol = await ERC20Read.symbol();
    return _symbol;
}



export async function allowance(
    tokenAddress: string,
    userAddress: string,

    approvee: string
) {
    const ERC20Read = await initializeERC20(tokenAddress);
    const _allowance = await ERC20Read.allowance(userAddress, approvee);
    return _allowance;
}
