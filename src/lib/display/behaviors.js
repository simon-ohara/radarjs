(function( _internal ) {
  var behaviors = _internal.display.behaviors = {},
      registered = [];

  behaviors.addTo = function ( display ) {
    registered.map( function( behavior, index, behaviorsArray ) {
      var thisBehavior = new behaviorsArray[ index ]( display );
    });
  };

  behaviors.register = function( behavior ) {
    registered.push( behavior ); 
  };

  // The Behaviors object
  // Contains a list of all behaviors available to the RadarDisplay
  // Calling init will return an array of initialised Physics behavior objects
  // _internal.display.behaviors = {
  //   init: init,
  //   list: behaviors
  // };

}( _internal ));
