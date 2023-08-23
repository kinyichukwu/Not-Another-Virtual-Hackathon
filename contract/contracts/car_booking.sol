// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarBookingContract {
    enum SessionState {
        Offline,
        Online
    }

    struct DriverInfo {
        string name;
        string carModel;
        string carLicensePlate;
        SessionState sessionState;
    }

    struct RideInfo {
        address driver;
        address rider;
        uint256 fare;
        bool isCompleted;
    }

    mapping(address => DriverInfo) public drivers;
    mapping(address => RideInfo[]) public rideHistory;

    event DriverOnline(address indexed driver);
    event DriverOffline(address indexed driver);
    event RideBooked(
        address indexed rider,
        address indexed driver,
        uint256 fare
    );
    event RideCompleted(
        address indexed rider,
        address indexed driver,
        uint256 fare
    );
    event PaymentReceived(
        address indexed driver,
        address indexed rider,
        uint256 amount
    );

    // Store driver's information and set session state
    function addDriverInfo(
        string memory _name,
        string memory _carModel,
        string memory _carLicensePlate
    ) external {
        drivers[msg.sender] = DriverInfo({
            name: _name,
            carModel: _carModel,
            carLicensePlate: _carLicensePlate,
            sessionState: SessionState.Offline
        });
    }

    // Set driver's session to online
    function setDriverOnline() external {
        require(bytes(drivers[msg.sender].name).length > 0, "Driver not found");
        drivers[msg.sender].sessionState = SessionState.Online;
        emit DriverOnline(msg.sender);
    }

    // Set driver's session to offline
    function setDriverOffline() external {
        require(bytes(drivers[msg.sender].name).length > 0, "Driver not found");
        drivers[msg.sender].sessionState = SessionState.Offline;
        emit DriverOffline(msg.sender);
    }

    // Store rider's information and book a ride
    function bookRide(address _driver, uint256 _fare) external payable {
        require(
            drivers[_driver].sessionState == SessionState.Online,
            "Driver is offline"
        );
        require(bytes(drivers[_driver].name).length > 0, "Driver not found");
        rideHistory[msg.sender].push(
            RideInfo({
                driver: _driver,
                rider: msg.sender,
                fare: _fare,
                isCompleted: false
            })
        );
        emit RideBooked(msg.sender, _driver, _fare);
    }

    // Make payment after a ride
    function completeRide(
        address _driver,
        uint256 _rideIndex
    ) external payable {
        require(
            _rideIndex < rideHistory[msg.sender].length,
            "Invalid ride index"
        );
        require(
            rideHistory[msg.sender][_rideIndex].driver == _driver,
            "Invalid driver"
        );
        require(
            rideHistory[msg.sender][_rideIndex].isCompleted == false,
            "Ride already completed"
        );
        require(
            msg.value >= rideHistory[msg.sender][_rideIndex].fare,
            "Insufficient payment"
        );

        // Handle payment logic here, transfer funds to the driver
        payable(_driver).transfer(msg.value);

        rideHistory[msg.sender][_rideIndex].isCompleted = true;
        emit RideCompleted(
            msg.sender,
            _driver,
            rideHistory[msg.sender][_rideIndex].fare
        );
        emit PaymentReceived(_driver, msg.sender, msg.value);
    }

    // Get driver's session state
    function getDriverSessionState(
        address _driver
    ) external view returns (SessionState) {
        return drivers[_driver].sessionState;
    }
}
