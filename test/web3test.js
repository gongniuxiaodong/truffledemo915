const Web3=require('web3')
let web3=new Web3()
var fs=require('fs')
// const ethereumUri='http://61.165.25.217:8002';
const ethereumUri='http://192.168.0.198:8002';
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    // console.log('connected to ehterum node at ' + ethereumUri);
    let coinbase = web3.eth.coinbase;
    // console.log('coinbase:' + coinbase);
    let balance = web3.eth.getBalance(coinbase);
    // console.log('balance:' + web3.fromWei(balance, 'ether') + " ETH");
    let accounts = web3.eth.accounts;
    // console.log(accounts);
}
var compiled=JSON.parse(fs.readFileSync('../build/contracts/DorlinkGateway.json'));
var testAbi=compiled.abi;
//console.log(testAbi);
// var testAddr="0xe5ed0004cf8be32de134b2fe1001ed9237f32fc9";
var testAddr=compiled.networks['999'].address;
//console.log(testAddr);
var testContract=web3.eth.contract(testAbi).at(testAddr);
var contractEvent=testContract.allEvents({fromBlock:0,toBlock:'latest'});
// console.log(contractEvent);
var i = 1;
var info=web3.eth.getBlock('latest')

console.log(info)
// console.log("start")
// contractEvent.watch(function(err, result) {
//     console.log("1111111");
//     if (err) {
//         console.log(err)
//         return;
//     }
//     console.log(i+"report:       "+result.args._value)
//     // check that result.args._from is web3.eth.coinbase then
//     // display result.args._value in the UI and call
//     // exampleEvent.stopWatching()
// })