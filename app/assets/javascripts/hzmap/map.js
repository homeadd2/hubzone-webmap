// import mapMarker from 'images/hubzone-map-marker.svg';
// import locationMarker from 'images/geolocation-marker.svg';

//create the map on load, when idle, jump to updateMap to get features
/* exported initMap */
HZApp.MapUtils.initMap = function() {

  var initialMapLocation = {
    center: {
      lat: 39.8282,
      lng: -98.5795
    },
    zoom: 5
  };

  // unpack the current hash and update the map location as needed
  initialMapLocation = HZApp.Router.unpackInitialMapLocation(initialMapLocation, location.hash);

  HZApp.map = new google.maps.Map(document.getElementById('map'), {
    center: initialMapLocation.center,
    zoom: initialMapLocation.zoom,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    mapTypeId: 'hz_map',
    mapTypeControlOptions: {
      mapTypeIds: ['hz_map','roadmap', 'hybrid' ],
      position: google.maps.ControlPosition.BOTTOM_CENTER,
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
    },
  });

  //reset mapType names
  //refer to maptype spec: https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapType
  HZApp.map.setOptions({'mapTypeControl':false});
  google.maps.event.addListenerOnce(HZApp.map, 'idle', HZApp.MapUtils.updateMapTypeNames);

  //adds in the hz style into the basemap picker
  var hzStyledMap = new google.maps.StyledMapType(HZApp.Styles.hzBaseMapStyle, {name: 'Gray'});
  HZApp.map.mapTypes.set('hz_map', hzStyledMap);

  //adds the map legend and geolocation button
  HZApp.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('legend'));
  HZApp.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('geolocation'));

  //add in the WMS tiles
  HZApp.WMTSUtils.initializeTiles();

  //add listener on the map for clicks
  HZApp.WMTSUtils.addClickListeners(HZApp.map);

  //add listener for map idle to update router hash center and zoom
  google.maps.event.addListener(HZApp.map, 'idle', HZApp.MapUtils.updateMapLocation);

  //add listener to the clear search
  HZApp.MapUtils.catchClearSearch('button.clear-search');

  //adds autocomplete and click listener
  HZApp.Autocomplete.createAutocomplete();
  HZApp.Autocomplete.createListener(HZApp.Autocomplete.autocomplete);

  // build out the markers
  /* jshint ignore:start */
  HZApp.Markers.hzQueryMarker = new HZApp.Constructors.HubzoneMapMarker({
    icon: mapMarker,
    scaledSize: 40
  });
  HZApp.Markers.hzUserLocation = new HZApp.Constructors.HubzoneMapMarker({
    icon: locationMarker,
    scaledSize: 17
  });
  /* jshint ignore:end */

  //build the legend
  HZApp.Legend.buildLegend(HZApp.Legend.legend);

  // build the sidebar
  HZApp.SidebarUtils.buildSidebar();

  //returns the map
  return HZApp.map;
}
