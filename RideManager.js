const Driver = require("../classes/Driver.js"); 
const Rider = require("../classes/Rider.js"); 

/** @class 
 * Manages all the asssignments between rider requests and drivers */ 
class RideManager {
    /** @constructor
     * represents the class mediating between the rider requests and the
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
    }
    
    /** @function
     * creates a list of the riders, both currently riding and waiting,
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

    /** @function
     * adds a driver from a sent http message 
     * @param {Object} req - the http request, contains req.body.name, the 
     * drivers name to be added to the drivers list */
    addDriver(req) {
        // FIXME: Allow Driver to have a capacity  in consrtuctor 
        console.log("adding driver"); 
        var driver = new Driver(req.body.name, 4); 
        this.drivers.push(driver); 
    } 
    
    /** @function
     * returns a JSON object containing all of the drivers 
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
    

/*    getAllRidersWaitingForDriver() {
        console.log("----------------WHY IS THIS BEING CALLED-------------------")
        console.log("      ")
        console.log("      ")
        console.log("      ")
        console.log("      ")
        console.log("      ")
        console.log("      ")
        console.log("      ")
        console.log("      ")
        var theQueue = [];

        this.drivers[index].pickupRider(riderName); 
        
    }*/

    /** @function 
     * finds the index of the driver in the driver list specified by
     * driverName
     * @param {string} driverName - the name of the driver whose index we are
     * looking for 
     * @returns the index of the driver if it exists, -1 otherwise */
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

    /** @function 
     * creates a new pickup requiest by creating a new rider and assigning
     * that to a driver 
     * @param {Object} req - the object representing the HTTP request*/
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

    /** @function
     * Pickups up the rider specified by riderName and the driver specified by
     * driverName
     * @param {string} driverName - the name of the driver who is picking up
     * the rider 
     * @param {string} riderName - the name of the rider who is being picked up*/
    pickupRider(driverName, riderName) {
        //console.log("pickup driver called");
        var index = this.findDriverIndex(driverName);
        this.drivers[index].pickupRider(riderName); 
    }
    
    /** @function 
     * deletes all of the drivers within the driver list 
     * also deletes all of the riders as well */
    deleteQueue() {
        console.log("DELETING ALL DRIVERS AND WAIIING RIDES"); 
        this.drivers = []; 
    }

    /** @function
     * drops off the rider specified by riderName who is assigned to the driver
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

} module.exports = RideManager; 
