const {ethers} = require('ethers')
const Abi = require('./src/web3/util/ABIs/IBlockplotERC1155.json')
const polygonRPCProvider = ethers.getDefaultProvider(
    //"https://rpc.ankr.com/polygon"
    'https://rpc-mumbai.maticvigil.com',
  );

const contract = new ethers.Contract('0xFE91c0605280B434E0A53e963eb54e3B250188b4', Abi, polygonRPCProvider)

async function getAmount(){
    const amount = await contract.balanceOf('0xa11D0625bb92a00a55f3C25B5571668877381B50', '1')
    console.log(+ethers.utils.formatUnits(amount, 'wei'))
    console.log(amount)
}

async function assets(){
    for(let i=0; i<=6; i++){
        const asset = await contract.idToMetadata(i)
        console.log(i, asset)
        console.log(ethers.utils.formatUnits(asset.costToDollar, 'wei'))
        console.log(ethers.utils.formatUnits(asset.totalSupply, 'wei'))
        console.log(ethers.utils.formatUnits(asset.vestingPeriod, 'wei'))
    }
}

getAmount()
assets()

// function frontDoorPassword(word) {
//     return word.trim().charAt(word.length - 1)
//   }

//   function backDoorResponse(line) {
//     let arr = []
//     for (let l of line){
//       const newLine = l.trim()
//       arr.push(l.trim().charAt(l.length - 1))
//     }
//     return arr
//   }
  
//   console.log(frontDoorPassword('SHIre'))

//   console.log(backDoorResponse([
//     'Compilers intensily bestow',
//     'On commencing without ego',
//     'Different processes ajar',
//     'Exit with zero quick',
//   ]))