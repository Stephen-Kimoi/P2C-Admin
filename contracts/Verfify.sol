// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

// Interface for farmdao contract
interface IFarmDAO {
    struct Dao {
        address address1;
        address address2;
        string description;
        string farmReports;
        string financialReports;
        string name;
        uint id;
        uint amountInvested;
        address[] investors;
    }

    function getAllDaos() external view returns (Dao[] memory);
}




contract VerifiedAddresses {
    address[] private verifiedAddresses;
    mapping(address => bool) private isVerified;
    IFarmDAO public farmDAO;
    IFarmDAO.Dao[] public allDaos; 
    mapping(uint => bool) public daoVerificationStatus;


    constructor(address farmDAOAddress) {
        farmDAO = IFarmDAO(farmDAOAddress);
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
    
    // Gets all DAOs created in the DAO contract
    function getAllDaos() external {
        allDaos = farmDAO.getAllDaos();
         
        // Set verification status to false
        for (uint i = 0; i < allDaos.length; i++) {
          daoVerificationStatus[allDaos[i].id] = false; // Initially set as not verified
        }
    }
    
    // Updating verification status of each DAO 
    function updateDaoVerificationStatus(uint daoId, bool isVerified) private onlyVerified {
        require(daoId > 0 && daoId <= allDaos.length, "Invalid DAO ID");

        daoVerificationStatus[daoId] = isVerified;
    }

    function performVerification(uint daoId) external onlyVerified {
        updateDaoVerificationStatus(daoId, true);
    }

    // Additional functions to manage the list of verified addresses
    function addVerifiedAddress(address _address) private onlyVerified {
        require(!isVerified[_address], "Address already verified");
        verifiedAddresses.push(_address);
        isVerified[_address] = true;
    }

    function removeVerifiedAddress(address _address) private onlyVerified {
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
