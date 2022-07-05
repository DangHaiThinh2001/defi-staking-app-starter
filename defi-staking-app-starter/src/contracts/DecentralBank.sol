// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./RWD.sol";
import './Tether.sol';


contract DecentralBank{
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) {
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }

    function depositTokens(uint _amount) public {
        require(_amount > 0, 'amount has to be greater than 0');
        
        // Transfer token from this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);
        
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update Status For Stakers
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstake Tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'balance has to be greater than 0');
        tether.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;

        // Update Status For Stakers
        isStaking[msg.sender] = false;
    }

    // Reward Tokens For Stakers
    function issueTokens() public{
        require(msg.sender == owner, 'caller must be the owner');
        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 100;
            if(balance > 0){
                rwd.transfer(recipient, balance);   
            }
        }
    }
}