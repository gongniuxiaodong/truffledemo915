const Web3=require('web3')
let web3=new Web3()
var fs=require('fs');
const ethereumUri='http://192.168.0.198:8002';
var account,account1,account2,account3,account4;
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
            /*account=web3.eth.accounts[0];
            account1=web3.eth.accounts[1];
            account2=web3.eth.accounts[2];
            account3=web3.eth.accounts[3];
            account4=web3.eth.accounts[4];
            web3.eth.defaultAccount=account;*/
            // var le='0xa4b48f34468114c4f694fc4e1f5dd54281b69bbf';
            // console.log(account1.length)
            // web3.personal.unlockAccount(account,'ubunt');
        }
    },
    initContract: function() {
        var contractJson=JSON.parse(fs.readFileSync('../build/contracts/Authority.json'));
        var contractAbi=contractJson.abi;
        var contractAddr=contractJson.networks['999'].address;
        App.contracts.contractInstance=web3.eth.contract(contractAbi).at(contractAddr);
        console.log('contract initialize successfully')
    },
    rentHouse:function (fromAccount, toAccount, getKeyPassword, unlockPassword, amount) {
        var contract=App.contracts.contractInstance;
        web3.personal.unlockAccount(fromAccount,unlockPassword);
        var ba = web3.eth.getBalance(fromAccount);console.log(ba)
        contract.rentHouse.sendTransaction(toAccount, getKeyPassword,{from:fromAccount,value:amount,gas:300000},function (e,r) {
            if(e){console.log(e)}
            else{console.log(r)}
        })
        // web3.miner.start();
        // setTimeout(web3.miner.stop,5000)

    },
    reset:function (fromAccount) {
        var contract=App.contracts.contractInstance;
        contract.resetRenter.sendTransaction({from:fromAccount},function (e,r) {
            if(e){console.log(e)}
            else{console.log(r)}
        });
        // web3.miner.start();
        // setTimeout(web3.miner.stop,5000);
        // contract.resetHouse.sendTransaction(account,{from:account},function (e,r) {
        //     if(e){console.log(e)}
        //     else{console.log(r)}
        // })
        // web3.miner.start();
        // setTimeout(web3.miner.stop,5000);
    },
    publish:function (fromAccount, houseKey, getKeyPassword, unlockPassword) {
        var contract=App.contracts.contractInstance;
        web3.personal.unlockAccount(fromAccount,unlockPassword);
        contract.publishHouse.sendTransaction(200,getKeyPassword,houseKey,{from:fromAccount,gas:3000000},function (e,r) {
            if(e){console.log(e)}
            else{console.log(r)}
        })
    },
    getKey: function(fromAccount, getKeyPassword) {

        var contract=App.contracts.contractInstance;
        // contract.rentHouse.sendTransaction(account1,10,'abcd',{from:account1,to:account},function (e,r) {
        //     if(e){console.log(e)}
        //     else{console.log(r)}
        // })

        var key=contract.getKey.call(fromAccount,getKeyPassword);
        if((key!='')&&(key!='false')){
            console.log('key is: '+key)
        }else{
            console.log('key is null')
        }
    },
}


App.initWeb3();
account=web3.eth.accounts[0];
account1=web3.eth.accounts[1];
account2=web3.eth.accounts[2];
account3=web3.eth.accounts[3];
account4=web3.eth.accounts[4];
web3.eth.defaultAccount=account;
App.initContract();
// var contract=App.contracts.contractInstance
// console.log(contract.getInfo.call())
// App.reset();
// App.publish(account, 'ubunt','abc', 'ubunt');
// App.rentHouse(account2, account, 'abcde', 'ubunt',200);
App.getKey(account3,'abcde');
//
