// var express=require('express');
// var app=express();
let http=require('http');
const Web3=require('web3')
let web3=new Web3()
let fs=require('fs');
let bodyParser = require('body-parser') ;
const ethereumUri='http://192.168.0.198:8002';
let express=require('express');
let app=new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var alerttypeBuf='';
var webserviceBuf=0;
App = {
    // web3Provider: null,
    contracts: {},
    initWeb3: function() {
        web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
        if(!web3.isConnected()){
            throw new Error('unable to connect to ethereum node at ' + ethereumUri);
        }else{
            console.log('web3 is connected');
        }
    },
    initContract: function() {
        var contractJson=JSON.parse(fs.readFileSync('../build/contracts/DorlinkGateway.json'));
        var contractAbi=contractJson.abi;
        var contractAddr=contractJson.networks['999'].address;
        App.contracts.contractInstance=web3.eth.contract(contractAbi).at(contractAddr);
    },
    readContract: function() {
        var contractEvent=App.contracts.contractInstance.AlertEvent({fromBlock:0,toBlock:'latest'});
        console.log("webservice start")
        contractEvent.watch(function(err, result) {
            console.log("watching webservice event");
            if (err) {
                console.log(err)
                return;
            }
            console.log("alert with: "+result.args.alertType)
            var alerttype=''+result.args.alertType;
            if(alerttypeBuf!=alerttype){
                alerttypeBuf!=alerttype;
                http.get('http://139.159.209.254:9000/test/alert?typeCode='+alerttype);
            }
        });
    },
    setContract:function (controlType) {
        var instance=App.contracts.contractInstance;
        var accout=web3.eth.accounts[0];
        instance.control.sendTransaction(controlType,{from:accout});
    }
}

App.initWeb3();
App.initContract();
App.readContract();
app.get('/Client/control',function (req,res) {
    if(webserviceBuf!=req.body.typeCode){
        webserviceBuf=req.body.typeCode;
        App.setContract(req.body.typeCode);
    }
})
app.listen(9004);
