const Web3=require('web3')
let web3=new Web3()
var fs=require('fs');
const ethereumUri='http://192.168.0.49:8003';
// const ethereumUri='http://127.0.0.1:8545'
var account,account1,account2;
App = {
    // web3Provider: null,
    contracts: {},
    initWeb3: function() {
        // Initialize web3 and set the provider to the testRPC.
        web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
        if(!web3.isConnected()){
            throw new Error('unable to connect to ethereum node at ' + ethereumUri);
        }else{
            console.log('web3 is connected');
            // account=web3.eth.accounts[0];
            // account1=web3.eth.accounts[1];
            // account2=web3.eth.accounts[2];
            // web3.eth.defaultAccount=account1;
        }
    },
    initContract: function() {
        var contractJson=JSON.parse(fs.readFileSync('../build/contracts/Authority_1020.json'));
        var contractAbi=contractJson.abi;
        var contractAddr="0xF963B51b2489cad7C6DFcDce517e49f47a1ce8A8";//"0x1BAff10d25Cc98783a8B05B9c3950CAba954e279"
        // App.contracts.contractInstance=web3.eth.contract(contractAbi).at(contractAddr);
        App.contracts.contractInstance=web3.eth.contract(contractAbi).at(contractAddr);
        console.log('contract initialize successfully')
    },
    watchRent:function () {
        var contractEvent=App.contracts.contractInstance.RentHouse({fromBlock:0,toBlock:'latest'});
        console.log("watching rent event")
        contractEvent.watch(function(err, result) {
            console.log("watching webservice event");
            if (err) {
                console.log(err)
                return;
            }
            console.log(result)
        });
    },
    watchPulish:function () {
        var contractEvent=App.contracts.contractInstance.PublishHouse({fromBlock:0,toBlock:'latest'});
        console.log("watching publish event")
        contractEvent.watch(function(err, result) {
            console.log("watching webservice event");
            if (err) {
                console.log(err)
                return;
            }
            console.log(result)
        });
    }

}

App.initWeb3();

App.initContract();
//
App.watchRent();
App.watchPulish();
var account="0x1BAff10d25Cc98783a8B05B9c3950CAba954e279";
web3.eth.getAccounts(console.log)

// web3.eth.getBalance(web3.eth.accounts[0],function (e,r) {
//     if(e)console.log(e)
//     else console.log(r)
// })
web3.eth.isSyncing(function (e,r) {
    if(e)console.log(e)
    else console.log(r)
})
// web3.personal.unlockAccount(account,"8615607415")
// web3.eth.sendTransaction({from:account,to:web3.eth.accounts[0],value:0.007,gas:3000000},function (e,r) {
//     if(e)console.log(e)
//     else console.log(r)
// })

