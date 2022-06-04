//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSale {
    uint256 public investorMinCap = 0.02 ether;
    uint256 public investorHardCap = 10 ether;
    uint256 public rate = 10;
    mapping(address => uint256) public contributions;
    IERC20 public token;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function buyTokens() public payable {
        uint256 _amount = msg.value * rate;
        require(
            _amount >= investorMinCap,
            "TokenSale: Minimum contribution is 0.02 ether"
        );
        require(
            contributions[msg.sender] + _amount <= investorHardCap,
            "TokenSale: Maximum contribution is 10 ether"
        );
        require(
            token.balanceOf(address(this)) >= _amount,
            "TokenSale: Not exceeds token balance"
        );

        contributions[msg.sender] += _amount;
        token.transfer(msg.sender, _amount);
    }
}
