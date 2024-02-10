// import the module
const mdns = require('multicast-dns');
 
// advertise a http server on port 4321
// const ad = mdns.createAdvertisement(mdns.tcp('http'), 4321);
// ad.start();
 
 
// discover all available service types
mdns.on('response', function(response) {
    console.log('got a response packet:', response)
  })
  
  mdns.on('query', function(query) {
    console.log('got a query packet:', query)
  })

  exports.getMDNS = () => {
          // lets query for an A record for 'brunhilde.local'
      mdns.query({
        questions:[{
          name: 'brunhilde.local',
          type: 'A'
        }]
      })
};

