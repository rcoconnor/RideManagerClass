const Driver = require("../classes/Driver.js"); 
const Rider = require("../classes/Rider.js"); 

const fs = require('fs');

/** Manages all the asssignments between rider requests and drivers */ 
class RideManager {
    /** represents the class mediating between the rider requests and the
     * drivers */
    constructor() {
        console.log("RideManager constructor called"); 
        this.drivers = []; 

        // methods which are bound to this class 
        this.addDriver = this.addDriver.bind(this);
        this.listDrivers = this.listDrivers.bind(this); 
        this.createPickupRequest = this.createPickupRequest.bind(this); 
        this.findDriverIndex = this.findDriverIndex.bind(this); 
        this.pickupRider = this.pickupRider.bind(this); 
        this.dropOffRider = this.dropOffRider.bind(this);  
        this.listRidersAssignedToDriver = this.listRidersAssignedToDriver.bind(this);  
        this.deleteQueue = this.deleteQueue.bind(this);
        this.isExistingDriver = this.isExistingDriver.bind(this);
        this.updateDriver = this.updateDriver.bind(this);
        this.writeToFile = this.writeToFile.bind(this);
    }
    
    /** creates a list of the riders, both currently riding and waiting,
     * assigned to the driver specified by driverName
     * @param {string} driverName - the name of the driver whose riders we are
     * interested in
     * @return {Object[]} a list of the the riders assigned to a specific
     * driver */
    listRidersAssignedToDriver(driverName) {
        var index = this.findDriverIndex(driverName);
        var waiting = this.drivers[index].waitingRiders; 
        var current = this.drivers[index].currentRiders;
        var obj = {
            "waitingRiders": waiting, 
            "currentRiders": current
        }; 
        return obj; 
    }

    /** adds a driver from a sent http message 
     * @param {Object} req - the http request, contains req.body.name, the 
     * drivers name to be added to the drivers list 
     * @param {string} req.body.name - the name of the driver to add 
     * @param {string} req.body.capacity - the capacity of the driver (not
     * actually implemented yet, defaults to 4) */
    addDriver(req) {
        // FIXME: Allow Driver to have a capacity  in consrtuctor 
        console.log("adding driver"); 
        var driver = new Driver(req.body.name, 4); 
        this.drivers.push(driver); 
    } 
    
    /** returns a JSON object containing all of the drivers 
     * @return {Object[]} a JSON object containing all of the drivers */ 
    listDrivers() {
        var listToReturn = []; 
        for (var i = 0; i < this.drivers.length; i++) {
            var newEntry = this.drivers[i]
            listToReturn.push(newEntry); 
        }
        console.log(JSON.stringify(this.drivers)); 
        return listToReturn;
    }
    

    /** finds the index of the driver in the driver list specified by
     * driverName
     * @param {string} driverName - the name of the driver whose index we are
     * looking for 
     * @return the index of the driver if it exists, -1 otherwise */
    findDriverIndex(driverName) {
        console.log("find driver index called");
        console.log()
        if (this.drivers!= undefined && this.drivers != []) {
            for (var i = 0; i < this.drivers.length; i++) {
                if(this.drivers[i].name == driverName) {
                    return i;  
                } 
            }
        }
        return -1; 
    }

    /** creates a new pickup by creating a new rider and assigning
     * that to a driver 
     * @param {Object} req - the object representing the HTTP request
     * @param {string} req.body.name - the name of the rider requesting the
     * ride 
     * @param {number} req.body.numPassengers - the total number of passengers
     * the request is for
     * @param {number} req.body.latitude - the latitude of the requested
     * pickup location
     * @param {number} req.body.longitude - the longitude of the requested
     * pickup location */
    createPickupRequest(req) {
        // FIXME: allow rider to enter capacity on front-end
        console.log("createPickupRequest() called"); 
        var newRider = new Rider(req.body.name, 1,req.body.latitude, req.body.longitude); 
        var minIndex = 0; 
        var min = 40; // we just need a sufficiently large number to start with 
        
        // FIXME: optimize how we select the driver
        //FIXME: manage which driver is assigned to the rider
        if (this.drivers!= undefined && this.drivers.waitingRiders != undefined && this.drivers.currentDrivers != undefined) {
            for (var i = 0; i < this.drivers.length; i++) {
                if(this.drivers[i].waitingRiders.length != undefined && 
                    this.drivers[i].currentDrivers.length != undefined ) {

                    var sum = this.drivers[i].waitingRiders.length  + this.drivers[i].currentDrivers.length; 
                    if (sum < min) {
                        min = sum; 
                        minIndex = i; 
                    }
                } else {
                    this.drivers[i].waitingRiders.push(newRider); 
                    return; 
                }
            }
        } else {
            console.log(JSON.stringify(this.drivers, null, '\t')); 
            this.drivers[0].waitingRiders.push(newRider);
            return; 
        } 
        this.drivers[minIndex].waitingRiders.push(newRider);  
    }

    /** Pickups up the rider specified by riderName and the driver specified by
     * driverName
     * @param {string} driverName - the name of the driver who is picking up
     * the rider 
     * @param {string} riderName - the name of the rider who is being picked up*/
    pickupRider(driverName, riderName) {
        //console.log("pickup driver called");
        var index = this.findDriverIndex(driverName);
        this.drivers[index].pickupRider(riderName); 
    }
    
    /** deletes all of the drivers within the driver list 
     * also deletes all of the riders as well */
    deleteQueue() {
        console.log("DELETING ALL DRIVERS AND WAIIING RIDES"); 
        this.drivers = []; 
    }

    /** drops off the rider specified by riderName who is assigned to the driver
     * specified by driverName
     * @param {string} driverName - the name of the driver who our rider is
     * assigned to 
     * @param {string} riderName - the name of the rider who is being dropped
     * off */
    dropOffRider(driverName, riderName) { 
        //console.log("dropping off driver"); 
        var index = this.findDriverIndex(driverName); 
        this.drivers[index].dropOffRider(riderName); 
    }; 

    /**
     * This function checks if the driver's Google subject already exists in drivers.json database file
     * returns true if driver already exists, false if driver is not already in the database file
     *
     * @param {string} userID - the ID representing sub in the databse file
     *
     * @return {boolean} returns true if rider is found, false if not
     */
    isExistingDriver(userID) {
        console.log("Looking for " + userID);
        if (!fs.existsSync("./drivers.json")) {
            console.log("Database file does not yet exist");
            return false;
        }
        var data = fs.readFileSync('./drivers.json', 'utf8');
        // parse JSON string from file to JSON object
        const drivers = JSON.parse(data);
        var found = false;
        drivers.forEach(db => {
            if (db.sub == userID) {
                // console.log(`${db.sub}:` + userID);
                found = true;
            }
        });
        return found;
    }

    /**
     * This function writes new information to the drivers.json database file, it creates the file if it does not already exist
     * 
     * @param {string} payload - the new json driver object to write to the file
     */
    writeToFile(payload) {
        if (!fs.existsSync("./drivers.json")) {
            let drivers = [];
            drivers.push(payload);
            fs.writeFile("./drivers.json", JSON.stringify(drivers, null, 4), 'utf8', function(err){
                if (err) return console.log("Error creating file: " + err);
                console.log("File created");
            });
        } else {
            fs.readFile('./drivers.json', 'utf8', (err, data) => {
                if (err) {
                    console.log(`Error reading file from disk: ${err}`);
                } else {
                    // parse JSON string to JSON object
                    const drivers = JSON.parse(data);
                    drivers.push(payload);
                    fs.writeFile('./drivers.json', JSON.stringify(drivers, null, 4), (err) => {
                        if (err) return console.log("Error updating file: " + err);
                        console.log("File updated");
                    });
                }
            });
        }
    }

    /**
     * This function updates existing entries in the drivers.json file when new information is sent
     * Returns true for success, false if subject does not exist in file
     *      
     * @param {string} subject  - the subject string to search for in the drivers.json file
     * @param {int}    capactiy - the new capacity that has been set
     *
     * @return {boolean} returns true if the driver exists and was updated, false if driver does not exist
     */
    updateDriver(subject, capacity) {
        console.log("looking for " + subject + " to change capacity to " + capacity);
        if (!fs.existsSync("./drivers.json")) return console.log("File does not exist yet");
        var data = fs.readFileSync('./drivers.json', 'utf8');
        // parse JSON string from file to JSON object
        const drivers = JSON.parse(data);
        var found = false;
        drivers.forEach(db => {
            if (db.sub == subject) {
                found = true;
                console.log(`${db.name}: ${db.carCapacity}`);
                db.carCapacity = capacity;
                console.log("--------CHANGED TO---------");
                console.log(`${db.name}: ${db.carCapacity}`);

                fs.writeFile('./drivers.json', JSON.stringify(drivers, null, 4), (err) => {
                    if (err) return console.log("Error updating file: " + err);
                    console.log("Existing driver updated");
                });
            }
        });
        if (found == false) {
            return console.log("Something went wrong, driver not found");
        }
    }

    /**
     * This function returns a driver's capacity from the drivers.json database file
     *      
     * @param {string} driverName - the name of the driver for which to return the capacity
     *
     * @return {int} the car capacity for the given driver
     */
    getDriverCapacity(userid) {
        var data = fs.readFileSync('./drivers.json', 'utf8');
        const drivers = JSON.parse(data);

        var capacity = 0;
        drivers.forEach(db => {
            if (db.sub == userid) {
                capacity = db.carCapacity;
            }
        });
        return capacity;
    }

} module.exports = RideManager; 
