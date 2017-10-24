// var express=require('express');
// var app=express();
let http=require('http');
const Web3=require('web3')
let web3=new Web3()
let fs=require('fs');
let bodyParser = require('body-parser') ;
const ethereumUri='http://180.162.215.101:8002';
let express=require('express')
let app=new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var symkeyID,symkey,docasyid,alertMesFilter,pubKey;
const controlTopic='0x00200000';
const alertTopic='0x00100000';
var account = "0x1BAff10d25Cc98783a8B05B9c3950CAba954e279";
var account2 = "0x7535a5681b518c67a7e26153a88b20a6771284f9";
App = {
    // web3Provider: null,
    contracts: {},
    initWeb3: function() {
        // Initialize web3 and set the provider to the testRPC.
        web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
        if(!web3.isConnected()){
            throw new Error('unable to connect to ethereum node at ' + ethereumUri);
        }else{
             console.log('connected to ehterum node at ' + ethereumUri)
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
        var contract = App.contracts.contractInstance;
        web3.personal.unlockAccount(fromAccount, unlockPassword);
        var balance = web3.eth.getBalance(fromAccount);
        console.log(balance.toString())
        var gasPrice = Promise.resolve(web3.eth.getGasPrice(function (e, r) {/* return r*/}));
        console.log(gasPrice._bitField)
        var gasCost = contract.rentHouse.estimateGas(toAccount, getKeyPassword, {from: fromAccount, value: amount});
        console.log(gasCost)
        var totalCost = amount + gasPrice._bitField * gasCost;
        console.log(totalCost)
        if (parseInt(balance.toString()) > totalCost) {
            contract.rentHouse.sendTransaction(toAccount, getKeyPassword, {
                from: fromAccount,
                value: amount,
                gas: gasCost
            }, function (e, r) {
                if (e) {console.log(e)}
                else {console.log(r)}
            })
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
    getKey: function(account, getKeyPassword) {
        var contract=App.contracts.contractInstance;
        var whisperKey=contract.getKey.call(account,getKeyPassword);
        if((whisperKey!='')&&(whisperKey!='false')){
            symkeyID=web3.shh.generateSymKeyFromPassword(whisperKey);//console.log(symkeyID)
            symkey=web3.shh.getSymKey(symkeyID);//console.log(symkey);//console.log('symkey length is:  '+symkey.length);
            docasyid=web3.shh.addPrivateKey(symkey);
            pubKey=web3.shh.getPublicKey(docasyid);
            alertMesFilter=web3.shh.newMessageFilter({
                privateKeyID:docasyid,
                topic:alertTopic,
            });
            console.log('key is: '+whisperKey)
        }else{
            console.log('key is null')
        }
    },
    readFilterMessages:function(){
        web3.shh.getFilterMessages(alertMesFilter,function (e,r) {
            if(e){console.log(e)}
            else{
                // console.log(r)
                console.log('messages incoming')
                if((r[r.length-1]!=null)&&(r[r.length-1].topic==alertTopic)) {
                    var alertType=r[r.length - 1].payload.substring(7);
                    console.log(alertType)//.payload)
                    http.get('http://139.159.209.254:9000/test/alert?typeCode='+alertType);
                }
            }
        })
    },
    sendWhisperMessage:function (controlType) {
        console.log('message posting')
        controlType='0x00000'+controlType;
        web3.shh.post({
            // pubKey:publicKey,
            pubKey:pubKey,
            // symKeyID:symkeyID,
            ttl:5 ,
            payload:controlType,
            topic:controlTopic,
            powTarget:2.5,
            powTime:2},function (e,r) {
            // web3.shh.post({symKeyID:symkeyID,sig:asykeyID,ttl:50 ,payload:'0x00000201',topic:topic, powTarget:2.5,powTime:2},function (e,r) {
            if(e){
                console.log('error happen in whisperSend is '+e)
            }
            else{
                console.log('whisperSend result is '+r)
            }
        });
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
}

App.initWeb3();
App.initContract();
App.watchRent();
setInterval(App.readFilterMessages,1000);
// App.readContract();
// App.sendTransaction("0xfb01a255c86750e08025cefd052c9a0f270bedc2","0x6d502187e86ee0c642197aa6d69d32dcc3aa0d34");


app.get('/Client/control',function (req,res) {
    console.log("1________"+req.query.typeCode);
    App.getKey(account2,'dorlink')
    App.sendWhisperMessage(req.query.typeCode);
    res.send("success");
})
// app.get('/Client/send',function (req,res) {
//     console.log("1________"+req.query);
//
//     res.send("success");
// })
app.get('/Client/send',function (req,res) {
    console.log("1________"+req.query);
    App.rentHouse(account2,account,'dorlink','8615607415',200);
    res.send("success");
})
app.get('/Client/delete',function (req,res) {
    console.log("1________"+req.query);
    App.deleteRenter(account,'8615607415');
    res.send("success");
})
app.listen(9004);

