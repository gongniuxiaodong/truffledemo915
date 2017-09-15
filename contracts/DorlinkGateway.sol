pragma solidity ^0.4.0;


contract DorlinkGateway {

    event ControlEvent(int controlType);
    event AlertEvent(int alertType);

    function control(int controlType)
    {
       ControlEvent(controlType);
    }

    function alert(int alertType)
    {
        AlertEvent(alertType);
    }

}
