//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract SampleToken is IERC20 {
    uint256 private _totalSupply;
    // mapping[address] => balances
    mapping(address => uint256 ) private _balances;
    // _alloances[from][to] => remaining
    mapping(address => mapping(address => uint256)) private _allowances;
    constructor() {
        _totalSupply = 1000000;
        _balances[msg.sender] = 1000000;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner)
        public
        view
        override
        returns (uint256 balance)
    {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _amount)
        public
        override
        returns (bool success)
    {
        require(_balances[msg.sender] >= _amount);
        _balances[msg.sender] -= _amount;
        _balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public override returns (bool success) {
        require(_balances[_from] >= _value);
        require(_allowances[_from][msg.sender] >= _value);
        _balances[_from] -= _value;
        _balances[_to] += _value;
        // _allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        override
        returns (bool success)
    {
        _allowances[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256 remaining)
    {
        return _allowances[_owner][_spender];
    }
}
