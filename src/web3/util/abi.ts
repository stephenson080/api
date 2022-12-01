export const blockplot = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_identityAddress',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'ApprovalForAll',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'symbol',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'costToDollar',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'vestingPeriod',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'initialSalePeriod',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'assetIssuer',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minted',
                type: 'uint256',
            },
        ],
        name: 'AssetInitialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'newAssetIssuer',
                type: 'address',
            },
        ],
        name: 'AssetIsserChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256[]',
                name: 'ids',
                type: 'uint256[]',
            },
            {
                indexed: false,
                internalType: 'uint256[]',
                name: 'values',
                type: 'uint256[]',
            },
        ],
        name: 'TransferBatch',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'TransferSingle',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'value',
                type: 'string',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'URI',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'vestingEnd',
                type: 'uint256',
            },
        ],
        name: 'VestingPeriodChanged',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
        ],
        name: '_idToMetadata',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalSupply',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'vestingPeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'initialSalePeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'costToDollar',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'initialized',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assetId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'assetIssuer',
                        type: 'address',
                    },
                ],
                internalType: 'struct ImprovisedERC1155.AssetMetadata',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'accounts',
                type: 'address[]',
            },
            {
                internalType: 'uint256[]',
                name: 'ids',
                type: 'uint256[]',
            },
        ],
        name: 'balanceOfBatch',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'burnAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256[]',
                name: 'ids',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        name: 'burnBatchAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newIdentityAddress',
                type: 'address',
            },
        ],
        name: 'changeIdentityAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'vestingEnd',
                type: 'uint256',
            },
        ],
        name: 'changeVestingPeriod',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'currentAssetId',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'idToMetadata',
        outputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'vestingPeriod',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'initialSalePeriod',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'costToDollar',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'initialized',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'assetIssuer',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'identityAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'initialSaleAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '_symbol',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: '_costToDollar',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_vestingPeriod',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_initialSalePeriod',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_assetIssuer',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_mintAmount',
                type: 'uint256',
            },
        ],
        name: 'initializeAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'isApprovedForAll',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'mintAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256[]',
                name: 'ids',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        name: 'mintBatchAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256[]',
                name: 'ids',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'safeBatchTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'newAssetIssuer',
                type: 'address',
            },
        ],
        name: 'setAssetIssuerAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'swapContractAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unPause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const token =  [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'initialSupply',
                type: 'uint256',
            },
            {
                internalType: 'string',
                name: 'tokenName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'subtractedValue',
                type: 'uint256',
            },
        ],
        name: 'decreaseAllowance',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'addedValue',
                type: 'uint256',
            },
        ],
        name: 'increaseAllowance',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
export const initialSale = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_assetContract',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'AssetBought',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'newSwapFee',
                type: 'uint256',
            },
        ],
        name: 'SwapFeeChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'priceFeedAddress',
                type: 'address',
            },
        ],
        name: 'TokenOracleSet',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
        ],
        name: 'balanceOfPair',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract IERC20Metadata',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'buyAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'newPairFee',
                type: 'uint256',
            },
        ],
        name: 'changePairFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'tokenAddresses',
                type: 'address[]',
            },
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'uint256[]',
                name: 'newPairFees',
                type: 'uint256[]',
            },
        ],
        name: 'changePairFeeBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'newSwapFee',
                type: 'uint256',
            },
        ],
        name: 'changeSwapFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
        ],
        name: 'feesFromPair',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAssetContract',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'onERC1155BatchReceived',
        outputs: [
            {
                internalType: 'bytes4',
                name: '',
                type: 'bytes4',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'onERC1155Received',
        outputs: [
            {
                internalType: 'bytes4',
                name: '',
                type: 'bytes4',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
        ],
        name: 'pairFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'chainlinkPriceFeed',
                type: 'address',
            },
        ],
        name: 'setTokenOracle',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'swapFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
        ],
        name: 'tokenOracle',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract IERC20Metadata',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract IERC20Metadata',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'withdrawFees',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const swap = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'assetAddress',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'stablecoinAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
        ],
        name: 'LiquidityAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'stablecoinAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
        ],
        name: 'LiquidityRemoved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'newSwapFee',
                type: 'uint256',
            },
        ],
        name: 'SwapFeeChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'stablecoinAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'isAmountInAsset',
                type: 'bool',
            },
        ],
        name: 'Swapped',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'stablecoinAddress',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'chainlinkPricefeed',
                type: 'address',
            },
        ],
        name: 'TokenOraclesSet',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [],
        name: '_swapFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: '_tokenOracle',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'isAmountInAsset',
                type: 'bool',
            },
        ],
        name: 'addLiquidity',
        outputs: [
            {
                internalType: 'uint256',
                name: 'shares',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount2',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'newSwapFee',
                type: 'uint256',
            },
        ],
        name: 'changeSwapFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId0',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'assetId1',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddressRoute',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amountIn',
                type: 'uint256',
            },
        ],
        name: 'hopSwap',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut1',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
        ],
        name: 'observe',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'reserve0',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'reserve1',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct SwapERC1155.PairReserve',
                name: 'pairReserve',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'onERC1155BatchReceived',
        outputs: [
            {
                internalType: 'bytes4',
                name: '',
                type: 'bytes4',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'onERC1155Received',
        outputs: [
            {
                internalType: 'bytes4',
                name: '',
                type: 'bytes4',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'protocolFeeBalanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: 'reserve0',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'reserve1',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'protocolFeeStatus',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_shares',
                type: 'uint256',
            },
        ],
        name: 'removeLiquidity',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount0',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'chainlinkPriceFeed',
                type: 'address',
            },
        ],
        name: 'setTokenOracle',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amountIn',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'isAmountInAsset',
                type: 'bool',
            },
        ],
        name: 'swap',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unPause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId0',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'assetId1',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddressRoute',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amountIn',
                type: 'uint256',
            },
        ],
        name: 'viewHopSwap',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut1',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amountIn',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'isAmountInAsset',
                type: 'bool',
            },
        ],
        name: 'viewSwap',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'assetId',
                type: 'uint256',
            },
        ],
        name: 'withdrawFees',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const blockplotViewer = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'startIndex',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'endIndex',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_blockPlotERC1155',
                type: 'address',
            },
        ],
        name: 'getAllInitializedAsset',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalSupply',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'vestingPeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'initialSalePeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'costToDollar',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'initialized',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assetId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'assetIssuer',
                        type: 'address',
                    },
                ],
                internalType: 'struct BlockPlotERC1155Viewer.AssetMetadata[]',
                name: 'batchSupply',
                type: 'tuple[]',
            },
            {
                internalType: 'uint256',
                name: 'relevantLength',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'startIndex',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'endIndex',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_blockPlotERC1155',
                type: 'address',
            },
        ],
        name: 'getAllNonVestedAsset',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalSupply',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'vestingPeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'initialSalePeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'costToDollar',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'initialized',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assetId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'assetIssuer',
                        type: 'address',
                    },
                ],
                internalType: 'struct BlockPlotERC1155Viewer.AssetMetadata[]',
                name: 'batchSupply',
                type: 'tuple[]',
            },
            {
                internalType: 'uint256',
                name: 'relevantLength',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'startIndex',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'endIndex',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_blockPlotERC1155',
                type: 'address',
            },
        ],
        name: 'getAllNonZeroAssetSupply',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalSupply',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'vestingPeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'initialSalePeriod',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'costToDollar',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'initialized',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assetId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'assetIssuer',
                        type: 'address',
                    },
                ],
                internalType: 'struct BlockPlotERC1155Viewer.AssetMetadata[]',
                name: 'batchSupply',
                type: 'tuple[]',
            },
            {
                internalType: 'uint256',
                name: 'relevantLength',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'startIndex',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'endIndex',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_blockPlotERC1155',
                type: 'address',
            },
        ],
        name: 'getUserNonZeroBalances',
        outputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: 'string',
                                name: 'name',
                                type: 'string',
                            },
                            {
                                internalType: 'string',
                                name: 'symbol',
                                type: 'string',
                            },
                            {
                                internalType: 'uint256',
                                name: 'totalSupply',
                                type: 'uint256',
                            },
                            {
                                internalType: 'uint256',
                                name: 'vestingPeriod',
                                type: 'uint256',
                            },
                            {
                                internalType: 'uint256',
                                name: 'initialSalePeriod',
                                type: 'uint256',
                            },
                            {
                                internalType: 'uint256',
                                name: 'costToDollar',
                                type: 'uint256',
                            },
                            {
                                internalType: 'bool',
                                name: 'initialized',
                                type: 'bool',
                            },
                            {
                                internalType: 'uint256',
                                name: 'assetId',
                                type: 'uint256',
                            },
                            {
                                internalType: 'address',
                                name: 'assetIssuer',
                                type: 'address',
                            },
                        ],
                        internalType:
                            'struct BlockPlotERC1155Viewer.AssetMetadata',
                        name: 'assetMetadata',
                        type: 'tuple',
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct BlockPlotERC1155Viewer.getterStructure[]',
                name: 'batchBals',
                type: 'tuple[]',
            },
            {
                internalType: 'uint256',
                name: 'relevantLength',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];

export const identityABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'userAddress',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'userId',
                type: 'uint256',
            },
        ],
        name: 'ReAssigned',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'userAddress',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'userId',
                type: 'uint256',
            },
        ],
        name: 'Revoked',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'userAddress',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'userId',
                type: 'uint256',
            },
        ],
        name: 'Verified',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'isUsedAddress',
        outputs: [
            {
                internalType: 'bool',
                name: 'isUsed',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'userId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'reAssign',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256[]',
                name: 'userIds',
                type: 'uint256[]',
            },
            {
                internalType: 'address[]',
                name: 'users',
                type: 'address[]',
            },
        ],
        name: 'reAssignBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'userId',
                type: 'uint256',
            },
        ],
        name: 'reAssignWaitlist',
        outputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'oldAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'timeOutEnd',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct Identity.reAssignWaitlistInfo',
                name: '_reAssignWaitlistInfo',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'userId',
                type: 'uint256',
            },
        ],
        name: 'resolveAddress',
        outputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'resolveId',
        outputs: [
            {
                internalType: 'uint256',
                name: 'userId',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'revoke',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'users',
                type: 'address[]',
            },
        ],
        name: 'revokeBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'verify',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'users',
                type: 'address[]',
            },
        ],
        name: 'verifyBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const priceConsumerV3ABI = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_costToDollar',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_decimals',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'priceFeedAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'feePercentage',
                type: 'uint256',
            },
        ],
        name: 'costToDollar',
        outputs: [
            {
                internalType: 'uint256',
                name: 'cost',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];

export const addresses = {
    token: '0xa8dB544157ad63bE5AB4D909a8319eDE0EA72faA',
    initialSale: '0xC12E62F28fABd17531298833deBcF98143e910E3',
    identity: '0x59c217C6c4d91926caa027D4c8393Cd35422666a',
    blockplotViewer: '0x4B0799Ccc23c2b555f2Edd50622E6FfB74cE0D17',
    blockplot: '0xD2b0bc902D9D984282937aDccDD1C8d472384a60',
    priceConsumer: '0x9eA7570DB96972aF8F488Ca5904e1A088caAc99d',
    swap: '0x9A0675e84F16513213330D0f186061EA95b126A0'
}
