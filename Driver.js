


/** @class 
 * Driver class, represents a driver */
class Driver {

    /** @constructor  
     * represents the driver class *
     * @param {string} driver_name - the name of the driver we are creating
     * @param {number} cap - the capacity of the driver we are creating */
    constructor(driver_name, cap) {
        console.log("correct constructor called!");  
        this.name = driver_name; 
        this.capacity = cap;  
        
        // drivers currently in the car waiting to be dropped off
        this.currentRiders = [];   
        // drivers waiting to get picked up  
        this.waitingRiders = []; 
    
        this.addNewPickup = this.addNewPickup.bind(this); 
        this.pickupRider = this.pickupRider.bind(this);  
        this.dropOffRider = this.dropOffRider.bind(this);  
    }
   

    /** @private @function 
     * private helper function for getting the index of a rider within a list
     * with the specified name
     * @param {string} name - the name of the rider we are looking for 
     * @param {Object[]} arr - the array we are searching through to find the rider 
     * @return the index of the rider, or -1 if the rider doesn't exist */ 
    getIndexOfRider(name, arr) {
        //console.log("getIndexOfRider() called");
        if(arr.length == 1) {
            return 0; 
        }
        for (var i = 0; i < arr.length; i++) {
            console.log("name: " + arr[i].name);  
            if (arr[i].name == name) {
                return i; 
            }
        }
        return -1; 
    } 
    

    /** @function 
     * adds a new rider to this.waitingRiders 
     * @param {string} riderName - the name of the rider we are creatin a new
     * pickup request for 
     * @param {number} lat - the latitude of the rider we are picking up 
     * @param {number} lon - the longitude of the rider we are picking up */ 
    addNewPickup(riderName, lat, lon) {
        var newEntry = {
            name: riderName, 
            latitude: lat, 
            longitude: lon
        };  
        this.waitingRiders.push(newEntry); 
    }
   
    /** @function
     * drops off the rider by removing it from the list of current riders
     * @param {string} name - the name of the driver we are dropping off */
    dropOffRider(name) {
        //console.log("dropOffRider called"); 
        var index = this.getIndexOfRider(name, this.currentRiders); 
        if (index != -1) {
            //console.log("index: " + index);  
            this.currentRiders.splice(index, 1); // remove one element at index 
        } else {
            console.log("**** ERROR INDEX RETURNED -1*****"); 
        }
    }

    /** @function
     * moves the rider from waiting riders to currentRiders 
     * @param {string} the name of the rider we are going to pick up */
    pickupRider(name) {
        //console.log("pickup rider called");
        var index = this.getIndexOfRider(name, this.waitingRiders);  
        if (index != -1) {
            console.log("the riders index exists in waiting riders"); 
            // remove the 1 element at the specified index
            // splice returns an array of one value, hence the [0]
            var driverToMove = this.waitingRiders.splice(index, 1)[0]; 
            this.currentRiders.push(driverToMove);
        } else {
            // FIXME: handle if the rider doesn't exist in the list 
            console.log("error: index returned -1"); 
        } 
         
    }
}



module.exports = Driver; 
