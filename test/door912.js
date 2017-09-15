var http=require('http');
const Web3=require('web3')

let web3=new Web3()
var fs=require('fs');
const ethereumUri='http://192.168.0.198:8002';
var gatewayBuf='';
var contractBinaryBuf=0;
var contractDoorlockBuf=false;
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
        var contractJson=JSON.parse(fs.readFileSync('../build/contracts/DorlinkGateway.json'));
        var contractAbi=contractJson.abi;
        var contractAddr=contractJson.networks['999'].address;
        App.contracts.contractInstance=web3.eth.contract(contractAbi).at(contractAddr);
        // web3.eth.getAccounts(console.log)
    },
    getAlldata:function(){
        http.get('http://192.168.0.134/api/interfaces',function (res) {
            //console.log('getting data from gateway')
            var json='';
            res.on('data',function (d) {
                json+=d;
            });
            res.on('end',function () {
                json=JSON.parse(json);
                for(i=0;i<json.devices.length;i++){
                    if(json.devices[i].type=='com.switch.binary'){
                        var  binaryValue=json.devices[i].properties.value;

                        if(contractBinaryBuf!=binaryValue){
                            console.log('binary is changed with'+binaryValue);
                            contractBinaryBuf=binaryValue;
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
                    }
                    else if(json.devices[i].type=='com.switch.doorLock') {
                        // console.log(json.devices[i].properties.value)
                        var doorValue=json.devices[i].properties.value;
                        // console.log(json.devices[i])
                        // console.log(doorValue)
                        if (contractDoorlockBuf !=doorValue ) {
                            contractDoorlockBuf =doorValue;
                            console.log('doorlock is changed with'+doorValue);
                            if (doorValue) {
                                App.setContract(202);
                            }else{
                                App.setContract(201);

                            }

                        }

                    }
                }
            });
        }).on('error',function (e) {
            console.error(e);
        });
    },
    readContract: function() {
        var contractEvent=App.contracts.contractInstance.ControlEvent({fromBlock:0,toBlock:'latest'});
        // console.log("start")
        contractEvent.watch(function(err, result) {
            console.log("watching control event");
            if (err) {
                console.log(err)
                return;
            }
            else {
                if (gatewayBuf!=""+result.args.controlType) {// console.log(""+result.args.controlType)
                    gatewayBuf=""+result.args.controlType;
                    App.setGateway("" + result.args.controlType);
                    console.log(result);
                }
            }
        })
    },
    setContract:function (controlType) {
        var instance=App.contracts.contractInstance;
        var account=web3.eth.accounts[0];
        instance.alert.sendTransaction(controlType,{from:account});
    },
    setGateway:function (controlType) {
        switch(controlType){
            case "102":
                http.get('http://192.168.0.134/api/devices/8/action/secure');
                break;
            case "101":
                http.get('http://192.168.0.134/api/devices/8/action/unsecure');
                break;
            case "104":
                http.get('http://192.168.0.134/api/devices/3/action/turnOff');
                break;
            case "103":
                http.get('http://192.168.0.134/api/devices/3/action/turnOn');
                break;
            default:
                break;
        }
    }
}
App.initWeb3();
App.initContract();
App.readContract();
setInterval(App.getAlldata,1000);
