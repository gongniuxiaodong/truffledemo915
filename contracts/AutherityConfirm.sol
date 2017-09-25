pragma solidity ^0.4.0;


contract AutherityConfirm {
    address private owner = msg.sender;
    string private  Key = 'ubunt';
    struct Renter{
       // address renter;
        string key;
        bool isRenter;
    }
    event renthouse(address from,address to,int value);

    mapping (address=>Renter) public renters;
    function rentHouse(address from, address to, int value){
        renthouse(address from,a)

    }
    modifier onlyBy(address owner)
    {
        if(msg.sender != owner)
            throw;
    }
    function addRenter(address renter){
       // renters[renter].renter =renter;
        renters[renter].isRenter = true;
        renters[renter].key = Key;
    }
    modifier onlyAfter(uint time){
        if (now < time) throw;
    }
}
