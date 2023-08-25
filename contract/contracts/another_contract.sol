// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserInfoContract {
    struct UserInfo {
        string name;
        string email;
        string phoneNumber;
        uint256 favoriteNumber;
    }

    mapping(address => UserInfo) public userInfos;
    address[] public users;

    event UserInfoUpdated(
        address indexed user,
        string name,
        string email,
        string phoneNumber,
        uint256 favoriteNumber
    );

    function updateUserInformation(
        string memory _name,
        string memory _email,
        string memory _phoneNumber,
        uint256 _favoriteNumber
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_phoneNumber).length > 0, "Phone number cannot be empty");

        if (userInfos[msg.sender].favoriteNumber == 0) {
            users.push(msg.sender);
        }

        userInfos[msg.sender] = UserInfo({
            name: _name,
            email: _email,
            phoneNumber: _phoneNumber,
            favoriteNumber: _favoriteNumber
        });

        emit UserInfoUpdated(
            msg.sender,
            _name,
            _email,
            _phoneNumber,
            _favoriteNumber
        );
    }

    function getUserInformation(
        address userAddress
    )
        external
        view
        returns (
            string memory name,
            string memory email,
            string memory phoneNumber,
            uint256 favoriteNumber
        )
    {
        UserInfo memory userInfo = userInfos[userAddress];
        name = userInfo.name;
        email = userInfo.email;
        phoneNumber = userInfo.phoneNumber;
        favoriteNumber = userInfo.favoriteNumber;
    }

    function getAllUsers() external view returns (address[] memory) {
        return users;
    }
}
