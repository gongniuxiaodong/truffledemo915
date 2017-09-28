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
    event FallbackCalled(bytes data);
    function(){ FallbackCalled(msg.data);  }
    Renter[] renters;
    House[] houses;

    event RentHouse(address from,address to,uint amount, string result);
    event PublishHouse(address owner, uint houPri, string houseKey, string accKey);


    function payRent(address b)private returns(bool result){
        bool isPay = b.send(this.balance);
        return isPay;
    }

    function getcontractBalance()constant returns(uint){
        return this.balance;
    }

    function publishHouse(uint houPri, string houKey,string accKey){
        houses.push(House({
        houseKey: houKey,
        owner: msg.sender,
        accountKey:accKey,
        housePrice: houPri
        }));
        // House[] memory housesTemp = houses;
        PublishHouse(msg.sender, houPri, houKey, accKey);
    }

    /*    function rentHouse(address to, uint amount, string passwd)returns(string result){

            if(msg.sender.balance < amount)throw;
            if(amount < housePrice)throw;
            RentHouse(msg.sender, to, amount);
    //        msg.sender.balance -= amount;
    //        to.balance += amount;
            addRenter(msg.sender, passwd);
            return 'pay successfully';
        }*/
    function rentHouse(address to, string accKey)payable returns(string result){
        House[] memory temp = houses;
        if(temp.length != 0){
            for(uint i=0;i<temp.length;i++){
                if(temp[i].owner == to){
                    if(msg.sender.balance > msg.value){
                        if(msg.value == temp[i].housePrice){
                            addRenter(msg.sender, accKey, temp[i].owner);
                            bool isPay = payRent(temp[i].owner);
                            string memory m1 = "pay successfully";
                            RentHouse(msg.sender, to, msg.value, m1);
                            if(isPay)
                            return m1;
                        }else{
                            string memory m2 = 'please pay correctly';
                            RentHouse(msg.sender, to, msg.value, m2);
                            msg.sender.transfer(msg.value);
                            return m2;}
                    }else{
                        string memory m3 = 'balance is not enough';
                        RentHouse(msg.sender, to, msg.value, m3);
                        msg.sender.transfer(msg.value);
                        return m3;}
                }else{
                    string memory m4 = 'not find house';
                    RentHouse(msg.sender, to, msg.value, m4);
                    msg.sender.transfer(msg.value);
                    return m4;}
            }
        }else{
            string memory m5 =  'no houses';
            RentHouse(msg.sender, to, msg.value, m5);
            msg.sender.transfer(msg.value);
            return m5;}
    }

    function addRenter(address renter, string accKey, address house) private{
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
            }
        }
    }


    function checkRenter(address renter, string passwd)internal returns (bool result) {
        Renter[] memory temp = renters;
        for(uint i=0;i<temp.length;i++){
            if(temp[i].renterName==renter){
                if(compareString(passwd, temp[i].accountKey))
                return true;
            }
            else{
                return false;
            }
        }
    }
    function resetRenter(address renter)returns (string result){
        for(uint i=0;i<renters.length;i++){
            if(renter == renters[i].renterName){
                renters[i].isRenter = false;
            }
        }
        return 'reset successfully';
    }
    function getContractAdd()returns (address addr){
        return this;
    }

    function getKey(address renter, string passwd)constant returns(string key){
        bool isRenter;
        Renter[] memory temp = renters;
        isRenter = checkRenter(renter, passwd);
        if(isRenter){
            for(uint i=0;i<temp.length;i++){
                if(temp[i].renterName==renter){
                    return temp[i].houseKey;
                }
            }
        }
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
