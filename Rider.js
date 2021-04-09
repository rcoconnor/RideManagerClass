/** @class 
 * represents the rider class */
class Rider {
    /** @constructor 
     * represents the rider class 
     * @param { string } riderName - the name of the rider 
     * @param { string } numRiders - the number of riders riding with the driver 
     * @param { number } lat - the latitude of the rider 
     * @param { number } lon - the longitude of the rider */
    constructor(riderName, numRiders, lat, lon) {
        this.riderName = riderName; 
        this.numRiders = numRiders; 
        this.latitude = lat; 
        this.lon = lon;
    }
} module.exports = Rider; 
