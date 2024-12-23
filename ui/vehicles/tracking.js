// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.
let map = null;
const vehiclelocation = [ -33.890542, 151.274856];
 const tripID = 'TRVBLR0005'
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: { lat: vehiclelocation[0], lng: vehiclelocation[1] },
    });
  
    setMarkers(map);
  }
  
  // Data for the markers consisting of a name, a LatLng and a zIndex for the
  // order in which these markers should display on top of each other.

 
  
  function setMarkers() {


    

    // Adds markers to the map.
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    const image = {
      url: "truck.svg",
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(40, 62),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };  
    
    new google.maps.Marker({
    position: { lat: vehiclelocation[0], lng: vehiclelocation[1] },
    map,
    icon: image,
    shape: shape,
    title: tripID,
    zIndex: 1,
    });

        //testing
        vehiclelocation[0] += 0.2;
        vehiclelocation[1] += 0.2;
    
  }
  
  window.initMap = initMap;

  setInterval(initMap, 10000);