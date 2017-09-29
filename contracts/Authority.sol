pragma solidity ^0.4.0;


contract Authority {

    struct Renter {
        string  houseKey;
        address renterName;
        string accountKey;
        bool isRenter;
    }

    struct House{
        string houseKey;
        string accountKey;
        address owner;
        uint housePrice;
    }
    struct doorlock{
        Renter[] renters;
        House[]  houses;
    }

    event FallbackCalled(bytes data);
    function(){ FallbackCalled(msg.data);  }

    Renter[] renters;
    House[]  public houses;

    event RentHouse(address from,address to,uint amount, string result,uint length);
    event PublishHouse(address owner, uint houPri, string houseKey, string accKey,uint length);
    event rentersChange(address renter, bool isRenter, string accKey, string houseKey, uint length);
    /*    event CheckRenter(address renter, string pass, bool r);
        event GetKey(address renter, string accKey, string houseKey, bool r);*/

    /*        function getInfo()returns(Renter[] r){
                return renters;
            }*/
    function payRent(address b)private returns(bool result){
        bool isPay = b.send(this.balance);
        return isPay;
    }

    function getcontractBalance()constant returns(uint){
        return this.balance;
    }

    function publishHouse(uint houPri, string houKey,string accKey){
        uint length = houses.push(House({
        houseKey: houKey,
        owner: msg.sender,
        accountKey:accKey,
        housePrice: houPri
        }));
        // House[] memory temp = houses;
        // uint length = houses.length;
        PublishHouse(msg.sender, houPri, houKey, accKey, length);
    }

    function rentHouse(address to, string accKey)payable returns(string result){
        House[] memory temp = houses;
        string memory message = '';
        if(temp.length != 0){
            for(uint i=0;i<temp.length;i++){
                if(temp[i].owner == to){
                    if(msg.sender.balance > msg.value){
                        if(msg.value == temp[i].housePrice){
                            addRenter(msg.sender, accKey, temp[i].owner);
                            uint length = temp.length;
                            bool isPay = payRent(temp[i].owner);
                            // message = "pay successfully";
                            // RentHouse(msg.sender, to, msg.value, message, length);
                            if(isPay)
                            message = "pay successfully";
                        }else{
                            message = 'please pay correctly';
                            // RentHouse(msg.sender, to, msg.value, m2, length);
                            msg.sender.transfer(msg.value);
                            // return message;
                        }
                    }else{
                        message = 'balance is not enough';
                        // RentHouse(msg.sender, to, msg.value, m3, length);
                        msg.sender.transfer(msg.value);
                        // return m3;

                    }
                }else{
                    message = 'not find house';
                    // RentHouse(msg.sender, to, msg.value, m4, length);
                    msg.sender.transfer(msg.value);// return m4;
                }
            }
        }else{
            message =  'no houses';
            // RentHouse(msg.sender, to, msg.value, m5, length);
            msg.sender.transfer(msg.value);//return m5;
        }
        RentHouse(msg.sender, to, msg.value, message, length);
        return message;
    }

    function addRenter(address renter, string accKey, address house)internal returns(Renter[] tempre){
        House[] memory temp = houses;
        for(uint i=0;i<temp.length;i++){
            if(temp[i].owner == house){
                // houKey=temp[i].houseKey;
                renters.push(Renter({
                renterName: renter,
                isRenter: true,
                houseKey: temp[i].houseKey,
                accountKey: accKey
                }));
                rentersChange(renter, true, temp[i].houseKey, accKey, renters.length);
            }
        }
        return renters;
    }

/*    function print()returns(doorlock){
        doorlock memory temp;
        temp.renters = renters;
        temp.houses = houses;
        return temp;
    }*/


    function checkRenter(address renter, string passwd)returns (string) {
        Renter[] memory temp = renters;
        string memory r='false';
        for(uint i=0;i<temp.length;i++){
            if(temp[i].renterName==renter){
                if(compareString(passwd, temp[i].accountKey))
                r = 'true';

            }
            else{
                // r = 'false';// bool r2 = false;
                continue;//return 'false';
            }
        }
        return r;
        // CheckRenter(renter, passwd, r);
    }
    function resetRenter()returns (string result){
        for(uint i=0; i< renters.length; i++){
                renters[i].renterName = 0;
                renters[i].houseKey = '';
                renters[i].accountKey = '';
                renters[i].isRenter = false;
        }
        for(uint j=0; j < houses.length; j++){
            houses[j].owner = 0;
            houses[j].houseKey = '';
            houses[j].accountKey = '';
            houses[j].housePrice = 0;
        }
        return 'reset successfully';
    }

    function getContractAdd()returns (address addr){
        return this;
    }

    function getKey(address renter, string passwd)constant returns(string key){
        string memory isRenter;
        Renter[] memory temp = renters;
        isRenter = checkRenter(renter, passwd);
        if(compareString(isRenter, 'true')){
            for(uint i=0;i<temp.length;i++){
                if(temp[i].renterName==renter){
                    /*  GetKey(renter, passwd, temp[i].houseKey, isRenter);*/
                    return renters[i].houseKey;
                }
            }
        }else{return isRenter;}

        // GetKey(renter, passwd, temp[i].houseKey, isRenter);
    }

    function compareString(string a, string b)internal returns(bool result){
        if(bytes(b).length == bytes(a).length){
            for(uint i=0;i < bytes(b).length;){
                if(bytes(b)[i] == bytes(a)[i]){
                    i++;
                }
                else{
                    return false;
                    break;
                }
            }
            return true;
        }
        else{
            return false;
        }
    }
}
