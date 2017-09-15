const Web3=require('web3')
let web3=new Web3();
const ethereumUri='http://192.168.0.198:8002';
var shh = web3.shh;
var appName = "doorLock";
var myName = "dorlink";
var topic='0x11222222'
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('web3 is connected');
}
var id = shh.newKeyPair();
var pubkey=shh.getPublicKey(id);
var prikey=shh.getPrivateKey(id);console.log(prikey)
var mesFilter=shh.newMessageFilter({privateKeyID:id,sig:pubkey,topics:[topic]});console.log(mesFilter)
 web3.shh.subscribe('messages',{privateKeyID:id,sig:pubkey,topics:topic})
// var mesFilterID=shh.getMessageFilter(mesFilter)
// shh.getFilterMessages(f).then(console.log);
// shh.post({ttl:7 ,topics:topic, powTarget:2.01,powTime:2});

// var replyWatch = shh.watch({
//     "topics": [ web3.fromAscii(appName), myIdentity ],
//     "to": myIdentity
// });
// var filter=shh.filter({
//     "topics": [ web3.fromAscii(appName), myIdentity ],
//     "to": myIdentity});
// // could be "topic": [ web3.fromAscii(appName), null ] if we wanted to filter all such
// // messages for this app, but we'd be unable to read the contents.
// filter.watch(function (m) {
//     console.log("Reply from " + web3.toAscii(m.payload) + " whose address is " + m.from);
// })
// replyWatch.arrived(function(m)
// {
//     // new message m
//     console.log("Reply from " + web3.toAscii(m.payload) + " whose address is " + m.from);
// });

// var broadcastWatch = shh.watch({ "topic": [ web3.fromAscii(appName) ] });
// broadcastWatch.arrived(function(m)
// {
//     if (m.from != myIdentity)
//     {
//         // new message m: someone's asking for our name. Let's tell them.
//         var broadcaster = web3.toAscii(m.payload).substr(0, 32);
//         console.log("Broadcast from " + broadcaster + "; replying to tell them our name.");
//         shh.post({
//             "from": eth.key,
//             "to": m.from,
//             "topics": [ eth.fromAscii(appName), m.from ],
//             "payload": [ eth.fromAscii(myName) ],
//             "ttl": 2,
//             "priority": 500
//         });
//     }
// });