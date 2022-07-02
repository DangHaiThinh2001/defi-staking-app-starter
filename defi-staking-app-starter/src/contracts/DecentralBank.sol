// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Tether.sol';
import "./RWD.sol";

contract DecentralBank{
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    constructor(Tether _tether, RWD _rwd){
        tether = _tether;
        rwd = _rwd;
    }
}