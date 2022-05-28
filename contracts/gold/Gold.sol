//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Gold is ERC20, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    mapping(address => bool) private _backList;
    event BlacklistAdded(address indexed account);
    event BlacklistRemoved(address indexed account);

    constructor() ERC20("GOLD", "GLD") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override whenNotPaused {
        require(
            _backList[_from] == false,
            "Gold: account sender was on blacklist"
        );
        require(
            _backList[_to] == false,
            "Gold: account sender was on blacklist"
        );

        super._beforeTokenTransfer(_from, _to, _amount);
    }

    function addToBlacklist(address _account)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            _account != msg.sender,
            "Gold: must not add sender to blacklist"
        );
        require(
            _backList[_account] == false,
            "Gold: account already in blacklist"
        );
        _backList[_account] = true;
        emit BlacklistAdded(_account);
    }

    function removeFromBlacklist(address _account)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            _backList[_account] == true,
            "Gold: account wasn't in blacklist"
        );
        _backList[_account] = false;
        emit BlacklistRemoved(_account);
    }
}
