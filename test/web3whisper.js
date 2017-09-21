var Web3=require('web3')
// var provider=require('web3-providers-http')
let web3=new Web3();
const ethereumUri='http://192.168.0.198:8002';
var topic='0x00200000';

var accounts0,accounts1;
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('web3 is connected');
    // console.log('accounts address is : '+web3.eth.accounts[0])
    // console.log('accounts length is :  '+web3.eth.accounts[0].length)
    accounts0=web3.eth.accounts[0];
    accounts1=web3.eth.accounts[1];
}
// var symkeyID=web3.shh.newSymKey();console.log(symkeyID);//console.log('symkeyID.length is : '+symkeyID.length)
// var asykeyID = web3.shh.newKeyPair();console.log(asykeyID);console.log('asykeyID.length is : '+asykeyID.length);
// var pubKey=web3.shh.getPublicKey(asykeyID);console.log(pubKey);console.log('pubKey.length is : '+pubKey.length);
// var priKey=web3.shh.getPrivateKey(asykeyID);console.log(priKey);console.log('priKey.length is : '+priKey.length);
// var docpubkey='0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa099652ce4df00c4c6e0263eafe05007a46fdf0c8d32b11aeabcd3abbc7b2bc2bb967368a68e9c6';
// var docprikey='0x234234e22b9ffc2387e18636e0534534a3d0c56b0243567432453264c16e78a2adc';
// var docasyid='3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f';
// console.log(docpubkey.length);
// console.log(docprikey.length);
// console.log(docasyid.length);
// const symkeyID='0043a500ae20f3cb37b6e9e37b3193a35b8ccac0ccc2d5bcbc60dc3b8aaf1a38'
// var symkeyID=web3.shh.generateSymKeyFromPassword('ubunt');console.log(symkeyID)
// var symkey=web3.shh.getSymKey(symkeyID);console.log(symkey);//console.log('symkey length is:  '+symkey.length);

// var isSymkeyDelete=web3.shh.deleteSymKey(symkeyID);console.log(isSymkeyDelete);
// var isSymkeyIDhasSymkey=web3.shh.hasSymKey(symkeyID);console.log(isSymkeyIDhasSymkey)

// var symkeyID2=web3.shh.generateSymKeyFromPassword('ubunt');//console.log(symkeyID2)
// var symkey2=web3.shh.getSymKey(symkeyID2);console.log(symkey2);
// var symkeyID3=web3.shh.addSymKey(symkey);
// var symkey3=web3.shh.getSymKey(symkeyID3);console.log(symkey3);
const mesFilter='d33d5f11429961be80167ee5297efb42c5852226e815f3bddc417b0066ddca9f';

// var mesFilter=web3.shh.newMessageFilter({
//     // pubKey:asykeyID,
//     topic:topic,
//     symKeyID:symkeyID,
//     // to:accounts1
//
// });console.log(mesFilter)

function sendWithsymkey() {
    web3.shh.post({
        // pubKey:publicKey,
        topic:topic,
        // from:accounts0,
        // to:accounts1,
        symKeyID:symkeyID,
        ttl:4,
        payload:'0x00000201',
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
// sendWithsymkey();


function read() {
    web3.shh.getFilterMessages(mesFilter,function (e,r) {
        if(e){console.log(e)}
        else{
            console.log(r)
        }
     });
}

setInterval(read,1000);




