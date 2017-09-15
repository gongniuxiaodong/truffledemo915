var express=require('express');
var app=express();
var http=require('http'); 
var web3=require('web3');


App = {
    web3Provider: null,
    contracts: {},
    getAlldata:function(){
        http.get('http://localhost/api/interfaces',function (res) {
            var json='';
            res.on('data',function (d) {
                json+=d;
            });
            res.on('end',function () {
                json=JSON.parse(json);
            });
            return json;
        }).on('error',function (e) {
            console.error(e);
        });
    },
    doorId:function () {
        var json=App.getAlldata();
        for(var item in json){
            if(item['type']=='com.switch.doorlock'){
                return  item.id;
                console.log('doorlock is online');}
            else{console.log('doorlock is off line');}
        }
    },
    initWeb3: function() {
        // Initialize web3 and set the provider to the testRPC.
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
        }
    },
    initContract: function() {
        $.getJSON('doorlock.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var doorlockArtifact = data;
            App.contracts.doorlock = TruffleContract(doorlockArtifact).at(data.address);

            // Set the provider for our contract.
            App.contracts.doorlock.setProvider(App.web3Provider);
            // Use our contract to retieve and mark the adopted pets.

        });
    },
    dooropen:function () {
        var doorid=App.doorId();
        App.setContract(true);
        http.post('localhost/api/devices/<doorid>/action/secure');
        console.log('contract was set and the lock was secure');
    },
    doorclose:function () {
        var doorid=App.doorId();
        App.setContract(false);
        http.post('localhost/api/devices/<doorid>/action/unsecure');
        console.log('contract was set and the lock was unsecure');
    },
    readContract: function(address) {
        App.contracts.doorlock.deployed().then(function (instance) {
            var door=instance;
            var addr=instance.address;
            door.getlock(addr).then(function (error,state) {
                if (error){
                    console.log(error+'happen in getlock')}
                else if(state){
                    http.post('address/api/devices/action/secure');
                    console.log('the lock was secure'); }
                else {
                    http.post('address/api/devices/action/unsecure');
                    console.log('the lock was unsecure');
                }
            })
        })

    },
    setContract:function (onoff) {
        var instance=App.contracts.doorlock;
        var accout=web3.eth.accounts[0];
        var door=instance.at(addr)
        door.doorlock.deployed().then(function (){
            door.setlock.sendTransaction(addr,onoff,{from:accout}).then(function (error,door) {
                if(error){console.log('setlock fail');}
                else {console.log('the lock is set with'+door[addr]);}
            })
        });
    },
    changesCheck:function () {
        http.get('http://192.168.1.42/api/refreshStates?last=9',function (res) {
            var json='';
            res.on('data',function (d) {
                json+=d;
            });
            res.on('end',function () {
                json=JSON.parse(json);
            });
            return json;
            for(var item in json){
                if(item['type']=='com.switch.doorlock'){console.log('doorlock is online');}
                else{console.log('doorlock is off line');}
            }

        }).on('error',function (e) {
            console.error(e);
        });
    }


}

module.exports=App;
