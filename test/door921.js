var http=require('http');
const Web3=require('web3')
let web3=new Web3()
var fs=require('fs');
const topic='0x00200000';
const symkeyID='7184f54d021653cfca92318ff68746233dadad7dcf9dc61276ea8d044584f3d7';
const mesFilter='d33d5f11429961be80167ee5297efb42c5852226e815f3bddc417b0066ddca9f';
const ethereumUri='http://192.168.0.198:8002';
const gatewayip='http://192.168.0.134/api/devices/';
const allDataip='http://192.168.0.134/api/interfaces';
// const allDataip='http://localhost/api/interfaces';
// const gatewayip='http://localhost/api/devices/';
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
            console.log('web3 account was unlock')
        }
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
                                    // App.whisperSend(204);
                                    break;
                                case 1:
                                    // App.whisperSend(203);
                                    break;
                                default:
                                    break;
                            }
                        }
                        else if(json.changes[i].id=doorID){
                            console.log('door changing')
                            var  doorValue=json.changes[i].value;
                            if (doorValue) {
                                // App.whisperSend(202);
                            }else{
                                // App.whisperSend(201);

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

    whisperReceive: function() {
        web3.shh.getFilterMessages(mesFilter,function (e,r) {
            if(e){console.log(e)}
            else{
                console.log(r)
                if(r[r.length-1]!=null) {
                     console.log(r[r.length-1].payload)//.payload)
                    var controlType=r[r.length-1].payload.substring(7);
                    App.setGateway(controlType);
                }
            }
        })
    },
    whisperSend:function (controlType) {
        web3.shh.post({
            // pubKey:publicKey,
            symKeyID:symkeyID,
            ttl:5 ,
            payload:'0x10000abb',
            topic:topic,
            powTarget:2.5,
            powTime:2},function (e,r) {
            // web3.shh.post({symKeyID:symkeyID,sig:asykeyID,ttl:50 ,payload:'0x00000201',topic:topic, powTarget:2.5,powTime:2},function (e,r) {
            if(e){console.log('error happen')
                console.log(e)
            }
            else{
                console.log(r)
            }
        });
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
    }
}
// Promise.all([App.initWeb3(),App.initContract()]).then(()=>{
//     Promise.all([App.readContract(),setInterval(App.getAlldata,1000)])
// })
App.initWeb3();
App.getAlldata();
console.time('t')
setInterval(App.whisperReceive,1000);
console.timeEnd('t')
