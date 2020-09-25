// IMPORTANT: Replace the apikey with your own from https://developer.here.com
let apiKey = 'gu2xI9YN1IE6pyN2NXUWHy-cilUtvePc9tKShlNwCY0';

// Step 1: Set up a basic map
var platform = new H.service.Platform({
  apikey: apiKey
});
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {
  center: { lat: 40.71, lng: -74.01 },
  zoom: 15,
  pixelRatio: window.devicePixelRatio || 1
});

window.addEventListener('resize', () => map.getViewPort().resize());

// this line sets up default event behavior, which we will need later
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers);

function addDraggableMarker(map, behavior) {

  // Step 2: Set up a marker and make it volatile and draggable
  var marker = new H.map.Marker({ lat: 40.71, lng: -74.01 }, {
    // mark the object as volatile for the smooth dragging
    volatility: true
  });

  // ensure that the marker can receive drag events
  marker.draggable = true;
  map.addObject(marker);

  // Step 3: Handle the dragstart event (user starts dragging the pointer)  
  map.addEventListener('dragstart', function (ev) {
    let target = ev.target;
    let pointer = ev.currentPointer;
    // check whether event target is a marker
    if (target instanceof H.map.Marker) {
      let targetPosition = map.geoToScreen(target.getGeometry());
      // calculate the offset between mouse and target's position  
      target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
      // disable the default draggability of the underlying map
      behavior.disable();
    }
  }, false);


  // Step 4: Handle the drag event (user is dragging the pointer)        
  map.addEventListener('drag', function (ev) {
    let target = ev.target;
    let pointer = ev.currentPointer;
    // check whether event target is a marker
    if (target instanceof H.map.Marker) {
      // set new position of marker to position of pointer, taking the offset from Step 3 into account
      target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
    }
  }, false);


  // Step 5: Handle the dragend event (user stops dragging the pointer) 
  map.addEventListener('dragend', function (ev) {
    let target = ev.target;
    // check whether event target is a marker
    if (target instanceof H.map.Marker) {
      // re-enable the default draggability of the underlying map
      behavior.enable();
    }
  }, false);

}

addDraggableMarker(map, behavior);