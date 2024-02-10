// import the module
const mdns = require('mdns');
 
// advertise a http server on port 4321
const ad = mdns.createAdvertisement(mdns.tcp('http'), 4321);
ad.start();
 
 
// discover all available service types
const browser = mdns.browseThemAll(); // all_the_types is just another browser..
browser.on('serviceUp', service => {
    console.log("service up: ", service);
  });
  browser.on('serviceDown', service => {
    console.log("service down: ", service);
  });
  browser.start();



