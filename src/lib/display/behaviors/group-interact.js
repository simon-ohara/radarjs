(function( _internal ) {

  var display;

  function behaviorMethods( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this );
        this.options( options );
      },
      connect: function( world ) {
        // display = world;
        display.on('interact:grab', this.grabConvoy, this);
        display.on('interact:release', this.releaseConvoy, this);
        
        // convoyBehaviors['interactive'].connect( view );
      },
      disconnect: function( world ) {
        display.off('interact:grab', this.grabConvoy, this);
        display.off('interact:release', this.releaseConvoy, this);
        
        // convoyBehaviors['interactive'].disconnect( view );
      },
      grabConvoy: function( data ) {
        if(data.body.entity === 'convoy') {
          display.selectedConvoy = data.body;
          display.selectedConvoy.selected = true;
          display.emit('display:convoy:grabbed', display.selectedConvoy);
        }
      },
      releaseConvoy: function( data ) {
        if(display.selectedConvoy) {
          display.emit('display:convoy:released', display.selectedConvoy);
          display.selectedConvoy.selected = false;
          delete display.selectedConvoy;
        }
      },
    };
  }

  function GroupInteractBehavior( displayInstance ) {
    display = displayInstance;
    // Register new behavior with the physics engine
    physics.behavior( 'group-interact', behaviorMethods );

    display.addBehavior( physics.behavior( 'group-interact' ) );
  }

  _internal.display.behaviors.register( GroupInteractBehavior );
}( _internal ));
