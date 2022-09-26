// const https = require('https');

// var options = {
//   "method": "GET",
//   "hostname": "rest.coinapi.io",
//   "path": "/v1/exchangerate/MATIC/ETH",
//   "headers": {'X-CoinAPI-Key': 'E06DA8D5-69DA-4639-B9A8-1B6AA50128BD'}
// };

// var request = https.request(options, function (response) {
//   var chunks = [];
//   response.on("data", function (chunk) {
//     chunks.push(chunk.toString());
//     console.log(chunks)
//   });
// });

// request.end();

const { ethers } = require("ethers") // for nodejs only
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
// const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
// const addr = "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046"
// const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)

// let decimals
// priceFeed.decimals().then(d => {
//   console.log(d)
//   priceFeed.latestRoundData()
//     .then((roundData) => {
//         // Do something with roundData
//         console.log(10 ^ d)
//         console.log(+ethers.utils.formatEther(roundData.answer) * Math.pow(10, d) * Math.pow(10, 2))


//     })
// })

// console.log(waltt.mnemonic())