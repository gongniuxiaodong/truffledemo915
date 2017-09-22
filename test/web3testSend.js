const Web3=require('web3')
let web3=new Web3()
var fs=require('fs')
var controlTopic='0x00200000';
const ethereumUri='http://192.168.0.198:8002';
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('web3 is connected');
}
var symkeyID2=web3.shh.generateSymKeyFromPassword('ubunt');console.log(symkeyID2)
var symkey2=web3.shh.getSymKey(symkeyID2);console.log(symkey2);
// const symkeyID='a45dc049fe33d0f53025fb89dc67dff9c839e442575a7ce3c1d78670da35f5a2';
// const docprikey='0xe545d1e6580c7b99167a01d9d58dcdd5b389d295f323abf4339f7226db147461';
var docasyid=web3.shh.addPrivateKey(symkey2);
var pubKey=web3.shh.getPublicKey(docasyid);
function sendWithsymkey() {
    web3.shh.post({
        pubKey:pubKey,
        // symKeyID:symkeyID,
        ttl:5,
        payload:'0x10000104',
        topic:controlTopic,
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