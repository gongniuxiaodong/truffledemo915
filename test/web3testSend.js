const Web3=require('web3')
let web3=new Web3()
var fs=require('fs')
var topic='0x11222222';
const ethereumUri='http://192.168.0.198:8002';
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('web3 is connected');
}
const symkeyID='7184f54d021653cfca92318ff68746233dadad7dcf9dc61276ea8d044584f3d7';
function sendWithsymkey() {
    web3.shh.post({
        // pubKey:publicKey,
        symKeyID:symkeyID,
        ttl:5 ,
        payload:'0x10000102',
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

    });/**/
}
sendWithsymkey();