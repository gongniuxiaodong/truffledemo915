
pragma solidity ^0.4.0;

contract sendtest {
    function send(address b, uint ab){
        b.transfer(ab);
    }
    /*struct Renter{
    address renterName;
    bool isRenter;
    string  password;
    }
    Renter[] renters = [('ssss')];
    function checkRenter(address renter, string passwd)returns (bool result){
        Renter[] memory temp =renters;
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
*//*    function sendtest(string a){
        string memory temp = b;
//        bool ist = compareString(a,temp);
        if(compareString(a,temp)){
            b = a;
        }

//        if(ss==sss)to.transfer(amount);
//        if(bytes10(temp) == bytes10(a))a=temp;

    }*//*
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
    }*/
/*    string a='sss';
    function storageTomenory(string b){
        string memory temp = a;
//        string c = 'sss';*//**//*
        if(b == temp){
            b = temp;
        }
    }*/

}

