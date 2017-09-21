var http=require('http')
var fs=require('fs');
const Web3=require('web3')
let web3=new Web3()
const ethereumUri='http://192.168.0.198:8002';
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));
if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('web3 is connected');
}
// console.time('e')
// var istrue=web3.personal.unlockAccount(web3.eth.accounts[0],'ubunt',24*60*60);
// console.log(istrue)
// console.timeEnd('e')
var result = web3.eth.sign(web3.eth.accounts[0],
    "0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49"); // second argument is web3.sha3("xyz")
console.log(result);
var result2=web3.eth.call(result)
console.log(result2)
// var istrue2=web3.personal.lockAccount(web3.eth.accounts[0],'ubunt');
// console.log(istrue2)
// console.timeEnd('e')
// fs.
/*setInterval(function () {
    console.time('changes')
    http.get('http://192.168.0.134/api/refreshStates?last='+last,function (res) {
    //     http.get('http://192.168.0.134/api/interfaces',function (res) {
        console.log('getting data from gateway')
            var json='';
            res.on('data',function (d) {
                json+=d;
            });
            res.on('end',function () {
                json=JSON.parse(json);
               // console.log(json.devices[3].properties)
            if(json.last==last){
                    ;
            }
            else {
               last=json.last;
               //var value=json.changes.value+'';
                for(i=0;i<json.changes.length;i++)
                {
                    if(json.changes[i].id==binaryID)
                    {
                        console.log('binary changing')
                    }
                    else if(json.changes[i].id=doorID){
                        console.log('door changing')
                    }
                }
            }
            });
        console.timeEnd('changes')
        })},2000);*/
