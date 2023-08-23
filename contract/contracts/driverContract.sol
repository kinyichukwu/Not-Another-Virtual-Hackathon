// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DriverInfoContract {
    enum SessionStatus {
        Offline,
        Online
    }

    struct DriverInfo {
        string name;
        string carModel;
        string carLicensePlate;
        string carColor; // New parameter
        string carDescription; // New parameter
        string driverPhoto; // Image URI for driver's photo
        string carPhoto; // Image URI for car's photo
        SessionStatus sessionStatus;
        address[] completedRides; // List of completed ride addresses
    }

    mapping(address => DriverInfo) public driverInfos;
    mapping(address => bool) public isDriver;
    address[] public drivers;

    event DriverSessionUpdated(
        address indexed driver,
        SessionStatus sessionStatus
    );
    event DriverInfoUpdated(
        address indexed driver,
        string name,
        string carModel,
        string carLicensePlate,
        string carColor,
        string carDescription,
        string driverPhoto,
        string carPhoto
    );
    event ImageMinted(
        address indexed driver,
        string driverPhoto,
        string carPhoto
    );
    event RideCompleted(address indexed driver, address indexed rider);

    modifier onlyDriver() {
        require(isDriver[msg.sender], "Driver not found");
        _;
    }

    function createDriver(
        string memory _name,
        string memory _carModel,
        string memory _carLicensePlate,
        string memory _carColor,
        string memory _carDescription,
        string memory _driverPhoto,
        string memory _carPhoto
    ) external {
        require(!isDriver[msg.sender], "Driver already exists");
        drivers.push(msg.sender);
        isDriver[msg.sender] = true;
        updateDriver(
            _name,
            _carModel,
            _carLicensePlate,
            _carColor,
            _carDescription,
            _driverPhoto,
            _carPhoto
        );
    }

    function updateDriver(
        string memory _name,
        string memory _carModel,
        string memory _carLicensePlate,
        string memory _carColor,
        string memory _carDescription,
        string memory _driverPhoto,
        string memory _carPhoto
    ) public onlyDriver {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_carModel).length > 0, "Car model cannot be empty");
        require(
            bytes(_carLicensePlate).length > 0,
            "Car license plate cannot be empty"
        );

        if (driverInfos[msg.sender].sessionStatus == SessionStatus.Online) {
            driverInfos[msg.sender].sessionStatus = SessionStatus.Offline;
            emit DriverSessionUpdated(msg.sender, SessionStatus.Offline);
        }

        driverInfos[msg.sender] = DriverInfo({
            name: _name,
            carModel: _carModel,
            carLicensePlate: _carLicensePlate,
            carColor: _carColor,
            carDescription: _carDescription,
            driverPhoto: _driverPhoto,
            carPhoto: _carPhoto,
            sessionStatus: SessionStatus.Offline,
            completedRides: new address[](0) // Initialize completed rides list
        });

        emit DriverInfoUpdated(
            msg.sender,
            _name,
            _carModel,
            _carLicensePlate,
            _carColor,
            _carDescription,
            _driverPhoto,
            _carPhoto
        );
    }

    function mintImages(
        string memory _driverPhoto,
        string memory _carPhoto
    ) external onlyDriver {
        driverInfos[msg.sender].driverPhoto = _driverPhoto;
        driverInfos[msg.sender].carPhoto = _carPhoto;
        emit ImageMinted(msg.sender, _driverPhoto, _carPhoto);
    }

    function updateDriverSession(
        SessionStatus _sessionStatus
    ) external onlyDriver {
        driverInfos[msg.sender].sessionStatus = _sessionStatus;
        emit DriverSessionUpdated(msg.sender, _sessionStatus);
    }

    function completeRide(address _rider) external onlyDriver {
        driverInfos[msg.sender].completedRides.push(_rider);
        emit RideCompleted(msg.sender, _rider);
    }

    function getDriverInfo(
        address driverAddress
    )
        external
        view
        onlyDriver
        returns (
            string memory name,
            string memory carModel,
            string memory carLicensePlate,
            string memory carColor,
            string memory carDescription,
            string memory driverPhoto,
            string memory carPhoto,
            SessionStatus sessionStatus,
            address[] memory completedRides
        )
    {
        DriverInfo memory driverInfo = driverInfos[driverAddress];
        name = driverInfo.name;
        carModel = driverInfo.carModel;
        carLicensePlate = driverInfo.carLicensePlate;
        carColor = driverInfo.carColor;
        carDescription = driverInfo.carDescription;
        driverPhoto = driverInfo.driverPhoto;
        carPhoto = driverInfo.carPhoto;
        sessionStatus = driverInfo.sessionStatus;
        completedRides = driverInfo.completedRides;
    }

    function getAllDrivers() external view returns (address[] memory) {
        return drivers;
    }
}
