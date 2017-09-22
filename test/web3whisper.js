var Web3=require('web3')
// var provider=require('web3-providers-http')
let web3=new Web3();
const ethereumUri='http://192.168.0.198:8002';
var topic='0x00200000';
var alertTopic='0x00100000'
var symkeyID,symkey,docasyid,controlMesFilter,alertMesFilter,pubKey;
var accounts0,accounts1;
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('web3 is connected');
    // console.log('accounts address is : '+web3.eth.accounts[0])
    // console.log('accounts length is :  '+web3.eth.accounts[0].length)
    // accounts0=web3.eth.accounts[0];
    // accounts1=web3.eth.accounts[1];
}
// var symkeyID=web3.shh.newSymKey();console.log(symkeyID);//console.log('symkeyID.length is : '+symkeyID.length)
// var asykeyID = web3.shh.newKeyPair();console.log(asykeyID);//console.log('asykeyID.length is : '+asykeyID.length);
// var pubKey=web3.shh.getPublicKey(asykeyID);console.log(pubKey);//console.log('pubKey.length is : '+pubKey.length);
// var priKey=web3.shh.getPrivateKey(asykeyID);console.log(priKey);//console.log('priKey.length is : '+priKey.length);
// var docpubkey='0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa099652ce4df00c4c6e0263eafe05007a46fdf0c8d32b11aeabcd3abbc7b2bc2bb967368a68e9c6';
// const docprikey='0xe545d1e6580c7b99167a01d9d58dcdd5b389d295f323abf4339f7226db147461';
// var symkeyID=web3.shh.generateSymKeyFromPassword('ubunt');console.log(symkeyID)
// var symkey=web3.shh.getSymKey(symkeyID);console.log(symkey);//console.log('symkey length is:  '+symkey.length);
//
// var docasyid=web3.shh.addPrivateKey(symkey);
// console.log(docpubkey.length);
// console.log(docprikey.length);
// console.log(docasyid.length);
// const symkeyID='a45dc049fe33d0f53025fb89dc67dff9c839e442575a7ce3c1d78670da35f5a2'

// var isSymkeyDelete=web3.shh.deleteSymKey(symkeyID);console.log(isSymkeyDelete);
// var isSymkeyIDhasSymkey=web3.shh.hasSymKey(symkeyID);console.log(isSymkeyIDhasSymkey)

// var symkeyID2=web3.shh.generateSymKeyFromPassword('ubunt');//console.log(symkeyID2)
// var symkey2=web3.shh.getSymKey(symkeyID2);console.log(symkey2);
// var symkeyID3=web3.shh.addSymKey(symkey);
// var symkey3=web3.shh.getSymKey(symkeyID3);console.log(symkey3);
// const mesFilter='d33d5f11429961be80167ee5297efb42c5852226e815f3bddc417b0066ddca9f';


symkeyID=web3.shh.generateSymKeyFromPassword('ubunt');//console.log(symkeyID)
symkey=web3.shh.getSymKey(symkeyID);//console.log(symkey);//console.log('symkey length is:  '+symkey.length);
docasyid=web3.shh.addPrivateKey(symkey);
alertMesFilter=web3.shh.newMessageFilter({
    privateKeyID:docasyid,
    topic:alertTopic,
});

function read() {
    // var symkeyID=web3.shh.generateSymKeyFromPassword('ubunt');console.log(symkeyID)
    // var symkey=web3.shh.getSymKey(symkeyID);console.log(symkey);//console.log('symkey length is:  '+symkey.length);
    // var docasyid=web3.shh.addPrivateKey(symkey);
    // // var symkeyID=web3.shh.generateSymKeyFromPassword('ubunt');//console.log(symkeyID)
    // var mesFilter=web3.shh.newMessageFilter({
    //     privateKeyID:docasyid,
    //     topic:topic,
    //     // symKeyID:symkeyID,
    //     // to:accounts1
    //
    // });//console.log(mesFilter)
    web3.shh.getFilterMessages(alertMesFilter,function (e,r) {
        if(e){console.log(e)}
        else{
            // console.log(r)
            if((r[r.length-1]!=null)&&(r[r.length-1].topic==alertTopic)) {
                console.log(r[r.length - 1].payload.substring(7))//.payload)
            }
            // web3.shh.deleteMessageFilter(mesFilter,function (e,r) {
            //     if(e){console.log(e);console.log('error happen in deleteMessageFilter')}
            //     else{console.log(r)}
            // });
        }
     });


}

setInterval(read,1000);




