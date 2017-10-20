pragma solidity ^0.4.0;


contract Doorlock {

    bool isopen;
    event ReturnValue(address indexed _from, string _value);


    function open() returns (string)
    {
        isopen = true;
        ReturnValue(msg.sender, "Door is opened");
        return "Door is opened";
    }

    function close() returns (string){
        isopen = false;
        return "Door is closed";
    }

    function getState() constant returns (string){
        if(isopen){
            return "Door state : open";
        }else{
            return "Door state :close";
        }

    }

}