pragma solidity ^0.4.0;


contract Authority {
    string private  Key = 'ubuntu';
    uint private housePrice =30000;
//    bool public test=true;
    struct Renter{
        address renterName;
        bool isRenter;
        string   password;
    }
    event RentHouse(address from,address to,uint amount);

    Renter[] public renters;

    mapping (address=>uint) balance;

    function rentHouse(address to, uint amount, string passwd)returns (string result){

        if(msg.sender.balance < amount)return 'balance is not enough';
        if(amount < housePrice)return 'payment in not enough';
        RentHouse(msg.sender, to, amount);
//        msg.sender.balance -= amount;
//        to.balance += amount;
        addRenter(msg.sender, passwd);
        return 'pay successfully';
    }


    function addRenter(address renter, string passwd){
        // renters[renter].renter =renter;
//        byte10 pass=passwd;
        renters.push(Renter({
        renterName: renter,
        isRenter: true,
        password: passwd
        }));
    }


    function checkRenter(address renter, string passwd)returns (bool result){
        Renter[] memory temp = renters;
        for(uint i=0;i<temp.length;i++){
            if(temp[i].renterName==renter){
                if(compareString(passwd, temp[i].password))
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

    function getKey(address renter, string passwd)returns(string key){
        bool isRenter = checkRenter(renter, passwd);
        if(isRenter){
                return Key;
        }
    }

    function compareString(string a, string b)returns(bool result){
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
