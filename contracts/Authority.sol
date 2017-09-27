pragma solidity ^0.4.0;


contract Authority {
//    string private  Key = 'ubuntu';
//    uint private housePrice =3;
//    bool public test=true;
    struct Renter {
        string  houseKey;
//        address houseName;
        address renterName;
        string accountKey;
        bool isRenter;

    }
    struct House{
        string houseKey;
        string accountKey;
        address owner;
   //     address houseaddress;
        uint housePrice;

    }

    event RentHouse(address from,address to,uint amount);

    Renter[] internal renters;
    House[] internal houses;
//    mapping (address=>uint) balance;
    function send(address b){
        b.transfer(10);
    }

    function publishHouse(uint houPri, string houKey,string accKey)private{
        houses.push(House({
            houseKey: houKey,
            owner: msg.sender,
            accountKey:accKey,
  //          houseaddress: houseAdd,
            housePrice: houPri
        }));
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
    function rentHouse(address to, uint amount, string accKey)returns(string result){
        House[] memory temp = houses;
        for(uint i=0;i<temp.length;i++){
            if(temp[i].owner == to){
                if(msg.sender.balance < amount)throw;
                if(amount < temp[i].housePrice)throw;
                RentHouse(msg.sender, to, amount);
//        msg.sender.balance -= amount;
//        to.balance += amount;
                addRenter(msg.sender, accKey, temp[i].owner);
                return 'pay successfully';
            }
        }
    }

    function addRenter(address renter, string accKey, address house) private{
        // renters[renter].renter =renter;
//        byte10 pass=passwd;
    //    string houKey;
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
