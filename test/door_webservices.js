// var express=require('express');
// var app=express();
let http=require('http');
const Web3=require('web3')
let web3=new Web3()
let fs=require('fs');
let bodyParser = require('body-parser') ;
const ethereumUri='http://61.165.5.254:8002';
let express=require('express')
let app=new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var symkeyID,symkey,docasyid,alertMesFilter,pubKey;
const controlTopic='0x00200000';
const alertTopic='0x00100000';

App = {
    // web3Provider: null,
    contracts: {},
    initWeb3: function() {
        // Initialize web3 and set the provider to the testRPC.
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
            console.log(accounts);

        }
    },
    rentHouse:function (fromAccount, toAccount, getKeyPassword, unlockPassword, amount) {
        var contract=App.contracts.contractInstance;
        web3.personal.unlockAccount(fromAccount,unlockPassword);
        var balance = web3.eth.getBalance(fromAccount);console.log(balance)
        contract.rentHouse.sendTransaction(toAccount,getKeyPassword,{from:fromAccount,value:amount,gas:300000},function (e,r) {
            if(e){console.log(e)}
            else{console.log(r)}
        })
        // web3.miner.start();
        // setTimeout(web3.miner.stop,5000)
    },
    getKey: function(account, getKeyPassword) {
        var contract=App.contracts.contractInstance;
        var whisperKey=contract.getKey.call(account,getKeyPassword);
        if(key!=''){
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

    sendTransaction:function(fromAccount,toAccount){
        console.log(fromAccount+"____"+toAccount);
        var code ="0x12345678901234567890123456789012";
        web3.eth.sendTransaction({from:fromAccount,to:toAccount,data:code}, function(err, transactionHash) {
            if (!err)

                console.log(code+"____________"+transactionHash); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
            else
                console.log(err);
        });
    }
}

App.initWeb3();
App.initContract();

setInterval(App.readFilterMessages,1000);
// App.readContract();
// App.sendTransaction("0xfb01a255c86750e08025cefd052c9a0f270bedc2","0x6d502187e86ee0c642197aa6d69d32dcc3aa0d34");


app.get('/Client/control',function (req,res) {
    console.log("1________"+req.query.typeCode);
    App.getKey();
    App.sendWhisperMessage(req.query.typeCode);
    res.send("success");
})
app.get('/Client/send',function (req,res) {
    console.log("1________"+req.query);
    App.rentHouse(web3.eth.accounts[1],web3.eth.accounts[0]);
    res.send("success");
})
/*app.get('/Client/send',function (req,res) {
    console.log("1________"+req.query);
    App.sendTransaction(web3.eth.accounts[0],web3.eth.accounts[1]);
    res.send("success");
})*/
app.listen(9004);

