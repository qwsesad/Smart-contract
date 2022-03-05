pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Donation {

    address public owner;
    mapping (address => bool) public exists;
    address[] public donators;
    mapping (address => uint) public sum;

    constructor () public {
        owner = msg.sender;
    }

    function GatherDonation() public payable {
        require(msg.value > 0, 'You are trying send 0 eth');
        sum[msg.sender] += msg.value;
        if(!exists[msg.sender])
        {
            exists[msg.sender] = true;
            donators.push(msg.sender);
        }
    }

    function TransferTo(address payable someone, uint value) external{
        require(msg.sender == owner, 'You are not owner');
        someone.transfer(value);
    }

    function GetDonators() public view returns (address[] memory)
    {
        return donators;
    }

    function GetSum(address donator) public view returns (uint)
    {
        return sum[donator];
    }
}