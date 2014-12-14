(function( _internal ) {

  function DisplayService() {
    var Display = this.display;

    console.log( Display );

    return {
      notify: function( channel, data ) {
        if( channel && typeof channel !== 'string' ) {
          throw new TypeError("Invalid channel assignment. " + channel + " is not a string");
        }

        Display.emit.apply( Display, arguments );
      }
    };
  }


  _internal.services.display = DisplayService;  
}( _internal ));
