// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./driverContract.sol";

contract RideContract {
    enum RideState {
        Requested,
        Accepted,
        Completed,
        Cancelled
    }

    struct RideInfo {
        RideState state;
        address rider;
        address driver;
        string pickupLocation;
        string destination;
        uint8[] riderReviews;
    }

    RideInfo[] public rides;
    mapping(address => RideInfo[]) public completedRides;

    event RideRequested(
        address indexed rider,
        string pickupLocation,
        string destination
    );
    event RideAccepted(
        address indexed rider,
        address indexed driver,
        uint256 rideIndex
    );
    event RideCompleted(address indexed rider, uint256 rideIndex);
    event RideCancelled(address indexed rider, uint256 rideIndex);
    event RiderReviewed(
        address indexed rider,
        uint256 rideIndex,
        uint8[] riderReviews
    );

    DriverInfoContract public driverContract;

    constructor(address _driverContractAddress) {
        driverContract = DriverInfoContract(_driverContractAddress);
    }

    modifier onlyDriver(address driverAddress) {
        require(driverContract.isDriver(driverAddress), "Driver not found");
        _;
    }

    modifier onlyRider(address riderAddress) {
        require(msg.sender == riderAddress, "Not authorized as rider");
        _;
    }

    function requestRide(
        string memory _pickupLocation,
        string memory _destination
    ) external {
        require(
            bytes(_pickupLocation).length > 0,
            "Pickup location cannot be empty"
        );
        require(bytes(_destination).length > 0, "Destination cannot be empty");

        rides.push(
            RideInfo({
                state: RideState.Requested,
                rider: msg.sender,
                driver: address(0),
                pickupLocation: _pickupLocation,
                destination: _destination,
                riderReviews: new uint8[](0)
            })
        );

        emit RideRequested(msg.sender, _pickupLocation, _destination);
    }

    function acceptRide(uint256 _rideIndex) external onlyDriver(msg.sender) {
        require(_rideIndex < rides.length, "Invalid ride index");
        require(
            rides[_rideIndex].state == RideState.Requested,
            "Ride not requested"
        );

        rides[_rideIndex].state = RideState.Accepted;
        rides[_rideIndex].driver = msg.sender;

        emit RideAccepted(rides[_rideIndex].rider, msg.sender, _rideIndex);
    }

    function completeRide(uint256 _rideIndex) external onlyDriver(msg.sender) {
        require(_rideIndex < rides.length, "Invalid ride index");
        require(
            rides[_rideIndex].state == RideState.Accepted,
            "Ride not accepted"
        );

        rides[_rideIndex].state = RideState.Completed;

        emit RideCompleted(rides[_rideIndex].rider, _rideIndex);

        // Store the completed ride data and map it to both the rider and the driver
        completedRides[rides[_rideIndex].rider].push(rides[_rideIndex]);
        completedRides[rides[_rideIndex].driver].push(rides[_rideIndex]);
    }

    function cancelRide(uint256 _rideIndex) external onlyRider(msg.sender) {
        require(_rideIndex < rides.length, "Invalid ride index");
        require(
            rides[_rideIndex].state == RideState.Requested,
            "Ride not requested"
        );

        rides[_rideIndex].state = RideState.Cancelled;

        emit RideCancelled(msg.sender, _rideIndex);
    }

    function reviewRide(
        uint256 _rideIndex,
        uint8[] memory _riderReviews
    ) external onlyRider(msg.sender) {
        require(_rideIndex < rides.length, "Invalid ride index");
        require(
            rides[_rideIndex].state == RideState.Completed,
            "Ride not completed"
        );
        require(_riderReviews.length > 0, "Review cannot be empty");

        for (uint256 i = 0; i < _riderReviews.length; i++) {
            require(
                _riderReviews[i] >= 1 && _riderReviews[i] <= 5,
                "Invalid review score"
            );
        }

        rides[_rideIndex].riderReviews = _riderReviews;

        emit RiderReviewed(msg.sender, _rideIndex, _riderReviews);
    }

    function getRideInfo(
        uint256 _rideIndex
    )
        external
        view
        returns (
            RideState state,
            address rider,
            address driver,
            string memory pickupLocation,
            string memory destination,
            uint8[] memory riderReviews
        )
    {
        require(_rideIndex < rides.length, "Invalid ride index");

        RideInfo memory rideInfo = rides[_rideIndex];
        state = rideInfo.state;
        rider = rideInfo.rider;
        driver = rideInfo.driver;
        pickupLocation = rideInfo.pickupLocation;
        destination = rideInfo.destination;
        riderReviews = rideInfo.riderReviews;
    }

    function getCompletedRides(
        address userAddress
    ) external view returns (RideInfo[] memory) {
        return completedRides[userAddress];
    }

    function getRideCount() external view returns (uint256) {
        return rides.length;
    }
}
