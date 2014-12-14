(function( _internal ) {
  _internal.display.renderer = function( screen ) {
    var thisConfig = {
      el: screen.name,
      width: screen.width,
      height: screen.height,
      meta: false
    };

    return physics.renderer( 'canvas', thisConfig );
  };
}( _internal ));
