(function() {
  function DisplayRenderer() {
    var screen = this.screen;

    var thisConfig = {
      el: screen.name,
      width: screen.width,
      height: screen.height,
      meta: false
    };

    return physics.renderer( 'canvas', thisConfig );
  };

  _root.display.modules.renderer = DisplayRenderer;
})();
