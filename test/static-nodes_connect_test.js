var http=require('http');
const Web3=require('web3')

let web3=new Web3()
var fs=require('fs');
var nodes=JSON.parse(fs.readFileSync('../static-nodes.json'))
console.log(nodes.length)
for (i=0;i<nodes.length;i++){
    var ip=nodes[i].split('@')[1]
    console.log(typeof(ip))
    web3.setProvider(new web3.providers.HttpProvider('http://'+ip));
    if(!web3.isConnected()){
        console.log('unable to connect to ethereum node at ' + ip)
        continue;
        // throw new Error('unable to connect to ethereum node at ' + ip);
    }else{
        console.log('web3 is connected');
        break;
    }

}