const Web3=require('web3')
var Promise = require('bluebird')
let web3=new Web3()
var fs=require('fs');
const ethereumUri='http://192.168.0.49:8003';
// const ethereumUri='http://127.0.0.1:8545'
// const ethereumUri='http://180.162.215.101:8002'
var account,account1,account2,account3,account4;
// var account=web3.eth.accounts[0];
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
        }
    },
    initContract: function() {
        var contractJson=JSON.parse(fs.readFileSync('../build/contracts/Authority_1020.json'));
        var contractAbi=contractJson.abi;
        // var contractAddr=contractJson.networks['999'].address;
        var contractAddr="0xF963B51b2489cad7C6DFcDce517e49f47a1ce8A8";//"0x1BAff10d25Cc98783a8B05B9c3950CAba954e279"
        App.contracts.contractInstance=web3.eth.contract(contractAbi).at(contractAddr);
        console.log('contract initialize successfully')
    },
    rentHouse:function (fromAccount, toAccount, getKeyPassword, unlockPassword, amount) {
        var contract=App.contracts.contractInstance;
        web3.personal.unlockAccount(fromAccount,unlockPassword);
        var balance = web3.eth.getBalance(fromAccount);
        console.log(balance.toString())
        var gasPrice = Promise.resolve(web3.eth.getGasPrice(function (e,r) {/* return r*/}));
        console.log(gasPrice._bitField)
        var gasCost = contract.rentHouse.estimateGas(toAccount, getKeyPassword,{from:fromAccount,value:amount});
        console.log(gasCost)
        var totalCost = amount + gasPrice._bitField * gasCost;
        console.log(totalCost)
        if(parseInt(balance.toString()) > totalCost){
            contract.rentHouse.sendTransaction(toAccount, getKeyPassword,{from:fromAccount,value:amount,gas:gasCost},function (e,r) {
                if(e){console.log(e)}
                else{console.log(r)}
            })
        }
    },
    reset:function (fromAccount,unlockPassword) {
        var contract=App.contracts.contractInstance;
        web3.eth.getGasPrice(console.log)
        web3.personal.unlockAccount(fromAccount,unlockPassword);
        console.log('unlock account successfully')
        var gascost =  contract.resetRenter.estimateGas({from:fromAccount});
        contract.resetRenter.sendTransaction({from:fromAccount,gas:gascost},function (e,r) {
            if(e){console.log(e)}
            else{console.log(r)}
        });
    },
    publish:function (housePrice, fromAccount, houseKey, getKeyPassword, unlockPassword) {
        var contract=App.contracts.contractInstance;
        web3.personal.unlockAccount(fromAccount,unlockPassword);
        web3.eth.getGasPrice(console.log)
        var gascost =  contract.publishHouse.estimateGas(housePrice,getKeyPassword,houseKey,{from:fromAccount});
        var hash = contract.publishHouse.sendTransaction(housePrice,getKeyPassword,houseKey,{from:fromAccount,gas:gascost},function (e,r) {
            if(e){console.log(e)}
            else{console.log(r)}
        });

    },
    getKey: function(fromAccount, getKeyPassword) {

        var contract=App.contracts.contractInstance;
        var key=contract.getKey.call(fromAccount,getKeyPassword);
        if((key!='')&&(key!='false')){
            console.log('key is: '+key)
        }else{
            console.log('key is null')
        }
    },
    deleteRenter: function (address,fromAccount,unlockPassword) {
        var contract=App.contracts.contractInstance;
        var balance = web3.eth.getBalance(fromAccount);
        console.log(address + '   balance is : '+ balance.toString())
        var gasPrice = Promise.resolve(web3.eth.getGasPrice(function (e,r) {/* return r*/}));
        console.log('gasrice is : '+ gasPrice._bitField)
        var gascost =  contract.deleteRenter.estimateGas(address,{from:fromAccount})
        console.log('gascost is : ' + addressgascost)
        var totalCost = amount + gasPrice._bitField * gasCost;
        console.log('totalcost is : '+ totalCost)
        if(parseInt(balance.toString()) > totalCost){
            web3.personal.unlockAccount(fromAccount,unlockPassword);
            console.log('unlock account successfully')
            contract.deleteRenter.sendTransaction(address,{from:fromAccount,gas:gascost},function (e,r) {
                if(e){console.log(e)}
                else{console.log(r)}
            });
        }
    },
}
var account = "0x1BAff10d25Cc98783a8B05B9c3950CAba954e279";
var account2 = "0x7535a5681b518c67a7e26153a88b20a6771284f9";
var hash = '0xb2d2b8fe7fff7051b37aadec73c57bcb452c304d541c249046ce72a69d50a1e9'
App.initWeb3();
App.initContract();
App.reset(account,'8615607415');
// App.deleteRenter(account2)
// App.publish(1200000000000, account, 'ubunt','dorlink', '8615607415');
// App.rentHouse(account2, account, 'dorlink', '8615607415',1200000000000);
// App.getKey(account2,'dorlink');