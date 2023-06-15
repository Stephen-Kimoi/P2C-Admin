// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract VerifiedAddresses {
    address[] private verifiedAddresses;
    mapping(address => bool) private isVerified;

    constructor() {
        // Add initial verified addresses during contract deployment
        verifiedAddresses.push(address(0x13Ef924EB7408e90278B86b659960AFb00DDae61)); // Replace with actual verified addresses
        verifiedAddresses.push(address(0x23792579e2979a98D12a33A85e35914079304a56));
        verifiedAddresses.push(address(0xdc4f6EA5856eDa459286e8D0eF42e389D07137Ff));

        // Set isVerified flag for each verified address to true
        for (uint256 i = 0; i < verifiedAddresses.length; i++) {
            isVerified[verifiedAddresses[i]] = true;
        }
    }

    modifier onlyVerified() {
        require(isVerified[msg.sender], "Unauthorized access");
        _;
    }

    function performAction() external onlyVerified {
        // Add your intended actions here
        // This function can only be executed by verified addresses
    }

    // Additional functions to manage the list of verified addresses
    function addVerifiedAddress(address _address) external onlyVerified {
        require(!isVerified[_address], "Address already verified");
        verifiedAddresses.push(_address);
        isVerified[_address] = true;
    }

    function removeVerifiedAddress(address _address) external onlyVerified {
        require(isVerified[_address], "Address not verified");
        for (uint256 i = 0; i < verifiedAddresses.length; i++) {
            if (verifiedAddresses[i] == _address) {
                verifiedAddresses[i] = verifiedAddresses[verifiedAddresses.length - 1];
                verifiedAddresses.pop();
                break;
            }
        }
        isVerified[_address] = false;
    }

    function isAddressVerified(address _address) external view returns (bool) {
        return isVerified[_address];
    }
}
