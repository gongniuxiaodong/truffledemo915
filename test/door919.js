var http=require('http');
const Web3=require('web3')

let web3=new Web3()
var fs=require('fs');
const ethereumUri='http://192.168.0.198:8002';
const gatewayip='http://192.168.0.134/api/devices/';
const allDataip='http://192.168.0.134/api/interfaces';
//const gatewayip='http://localhost/api/devices/';
var gatewayBuf='';
var doorID=null;
var binaryID=null;
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
            var account=web3.eth.accounts[0];
            web3.personal.unlockAccount(account,'ubunt');
        }
    },
    initContract: function() {
        var contractJson=JSON.parse(fs.readFileSync('../build/contracts/DorlinkGateway.json'));
        var contractAbi=contractJson.abi;
        var contractAddr=contractJson.networks['999'].address;
        App.contracts.contractInstance=web3.eth.contract(contractAbi).at(contractAddr);
        // web3.eth.getAccounts(console.log)
    },
    getAlldata:function(){
        http.get(allDataip,function (res) {
            //console.log('getting data from gateway')
            console.time('get')
            var json='';
            res.on('data',function (d) {
                json+=d;
            });
            res.on('end',function () {
                json=JSON.parse(json);
                for(i=0;i<json.devices.length;i++){
                    if(json.devices[i].type=='com.switch.binary'){
                        binaryID=json.devices[i].id;
                        //   console.log(binaryID)
                    }
                    else if(json.devices[i].type=='com.switch.doorLock') {
                        doorID=json.devices[i].id;
                        // console.log(doorID)
                    }
                }
            });
            console.timeEnd('get')
        }).on('error',function (e) {
            console.error(e);
            console.log('none is getting back')
        });
    },
    getChanges:function(){
        var last=fs.readFileSync('./last').toString().substr(5)
        http.get('http://192.168.0.134/api/refreshStates?last='+last,function (res) {
            //console.log('getting data from gateway')
            console.time('get')
            var json='';
            res.on('data',function (d) {
                json+=d;
            });
            res.on('end',function () {
                json=JSON.parse(json);
                if(json.last==last){
                    ;
                }
                else {
                    last=json.last;
                    var data='last='+last;
                    fs.writeFileSync('./last',data)
                    //var value=json.changes.value+'';
                    for(i=0;i<json.changes.length;i++)
                    {
                        if(json.changes[i].id==binaryID)
                        {
                            console.log('binary changing')
                            var  binaryValue=json.changes[i].value;
                            switch (binaryValue)
                            {
                                case 0:
                                    App.setContract(204);
                                    break;
                                case 1:
                                    App.setContract(203);
                                    break;
                                default:
                                    break;
                            }
                        }
                        else if(json.changes[i].id=doorID){
                            console.log('door changing')
                            var  doorValue=json.changes[i].value;
                            if (doorValue) {
                                App.setContract(202);
                            }else{
                                App.setContract(201);

                            }
                        }
                    }
                }
            });
            // console.timeEnd('get')
        }).on('error',function (e) {
            console.error(e);
            console.log('none is getting back')
        });
    },

    readContract: function() {
        //  console.time('re')
        var contractEvent=App.contracts.contractInstance.ControlEvent({fromBlock:'latest',toBlock:0});
        // console.log("start")
        contractEvent.watch(function(err, result) {
            console.time('re')
            console.log("watching control event");
            if (err) {
                console.log(err)
                return;
            }
            else {
                if (gatewayBuf!=""+result.args.controlType) {// console.log(""+result.args.controlType)
                    gatewayBuf=""+result.args.controlType;
                    App.setGateway("" + result.args.controlType);
                    console.timeEnd('re')
                    //   console.log(result);
                }
                else {console.log('set same gateway')}
            }
        })
        //console.timeEnd('re')
    },
    setContract:function (controlType) {
        var instance=App.contracts.contractInstance;
        var account=web3.eth.accounts[0];
        //  web3.personal.unlockAccount(account,'ubunt',24*60*60);//
        //   web3.personal.unlockAccount(account,'ubunt').then(
        instance.alert.sendTransaction(controlType,{from:account});//.on('error',console.error);//);
        //;//)

    },
    setGateway:function (controlType) {
        switch(controlType){
            case "102":
                http.get(gatewayip+doorID+'/action/secure');
                //  console.log(gatewayip+doorID+'/action/secure')
                console.log('door is lock')
                break;
            case "101":
                http.get(gatewayip+doorID+'/action/unsecure');
                //  console.log(gatewayip+doorID+'/action/unsecure')
                console.log('door is unlock')
                break;
            case "104":
                http.get(gatewayip+binaryID+'/action/turnOff');
                console.log('light is off')
                break;
            case "103":
                http.get(gatewayip+binaryID+'/action/turnOn');
                console.log('light is on')
                break;
            default:
                break;
        }
    },
    unlockaccount:function () {
        return new Promise(function(resolve,reject){
            web3.personal.unlockAccount(web3.eth.accounts[0],'ubunt',24*60*60);
        });

    }
}
// Promise.all([App.initWeb3(),App.initContract()]).then(()=>{
//     Promise.all([App.readContract(),setInterval(App.getAlldata,1000)])
// })
App.initWeb3();
App.initContract();
App.getAlldata();
// App.unlockaccount();
console.time('t')
App.readContract();
setInterval(App.getChanges,500);
console.timeEnd('t')
