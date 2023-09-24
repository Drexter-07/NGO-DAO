// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrphanAid {
    address public owner;
    
    struct Orphan {
        string name;
        string gender;
        address payable wallet;
    }
    
    Orphan[] public orphans;
    
    event Donated(address indexed donor, uint256 amount, address indexed orphanWallet);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this");
        _;
    }
    
    function addOrphan(string memory _name, string memory _gender, address payable _wallet) external onlyOwner {
        Orphan memory newOrphan = Orphan({
            name: _name,
            gender: _gender,
            wallet: _wallet
        });
        
        orphans.push(newOrphan);
    }
    
    function donateToOrphan(uint256 _orphanIndex) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(_orphanIndex < orphans.length, "Invalid Orphan Index");
        
        Orphan storage orphan = orphans[_orphanIndex];
        orphan.wallet.transfer(msg.value);
        
        emit Donated(msg.sender, msg.value, orphan.wallet);
    }
    
    function getOrphansCount() external view returns (uint256) {
        return orphans.length;
    }
}
