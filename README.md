# RideManagerClass


### tutorial ###

First, clone this repository into an existing node.JS express project

next, in the file which you will be using it, create an instance of the RideManager class

```javascript
const RideManager = require("../path/to/RideManager.js")
var rideManager = new RideManager(); 
```

The above code will create an instance of the RideManager class.  It will be 
responsible for tracking all of the drivers and riders


to connect a http request to a function of the ride manager class, first create
a route, which will call the function everytime it is called.  

an example route: 

```javascript
router.get('/list', functino(req, res, next){
    var list = rideManager.listDrivers() 
    res.send(JSON.stringify(list)); 
});
```

the above code will create a route.  Whenever someone sends the server a HTTP
get request, it will call the listDrivers() method of the RideManager class,
and send the result back as the response. 




