// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Tether {
  string public name = 'Tether';
  string public symbol = 'USDT';
  uint public totalSupply = 1000000000000000000;
  uint8 public decimals = 18;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint _value
  );

  event Approve(
    address indexed _owner,
    address indexed _spender,
    uint _value
  );

  mapping(address => uint) public balanceOf;

  constructor (){
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint _value) public returns (bool success){
    require(balanceOf[msg.sender] >= _value);
    //tranfer
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to);
}
