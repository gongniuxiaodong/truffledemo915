const Web3=require('web3')
let web3=new Web3()
var fs=require('fs');
const ethereumUri='http://192.168.0.198:8002';
var account,account1;
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
            account=web3.eth.accounts[0];
            account1=web3.eth.accounts[1];
            web3.eth.defaultAccount=account1;
            // var le='0xa4b48f34468114c4f694fc4e1f5dd54281b69bbf';
            console.log(account1.length)
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
    rentHouse:function () {
        var contract=App.contracts.contractInstance;
        contract.rentHouse.sendTransaction(account1,10,'abc',{from:account1,to:account},function (e,r) {
            if(e){console.log(e)}
            else{console.log(r)}
        })
    },
    getKey: function() {

        var contract=App.contracts.contractInstance;
        // contract.rentHouse.sendTransaction(account1,10,'abcd',{from:account1,to:account},function (e,r) {
        //     if(e){console.log(e)}
        //     else{console.log(r)}
        // })
        var key=contract.getKey.call(account1,'abcd');
        if(key!=''){
            console.log('key is: '+key)
        }else{
            console.log('key is null')
        }
    }

}

App.initWeb3();
//
App.initContract();
// App.rentHouse();
App.getKey();
