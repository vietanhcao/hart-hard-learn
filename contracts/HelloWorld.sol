//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "hardhat/console.sol";


contract HelloWorld {
  string public message;
  
  constructor(string memory _message){
    message = _message;
  }

  function printHelloWorld() public view returns (string memory) {
    return message;
  }

  function updateMessage(string memory _message) public {
    console.log("_message", _message);
    message = _message;
  }

}