var http=require('http')
/*
setInterval(function () {
    http.get('http://192.168.0.134/api/refreshStates?last=3',function (res) {
        console.log('getting data from gateway')
            var json='';
            res.on('data',function (d) {
                json+=d;
            });
            res.on('end',function () {
                json=JSON.parse(json);
                console.log(json)
            });
        })},2000);*/
// http.get('http://192.168.0.134/api/devices/3/action/turnOff');
// let bodyParser = require('body-parser') ;
// let express=require('express');
// let app=new express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// http.get('http://139.159.209.254:9000/test/alert?typeCode=201');
http.get('http://192.168.0.134/api/interfaces',function (res) {
    console.log('getting data from gateway')
    var json='';
    res.on('data',function (d) {
        json+=d;
    });
    res.on('end',function () {
        json = JSON.parse(json);
        console.log(json.devices[6].properties.value);
    });
})

