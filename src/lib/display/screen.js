(function() {

  var element,
      screenWidth = _global.innerWidth,
      screenHeight = _global.innerHeight;
  
  element = _dom.createElement('canvas');
  element.id = 'RadarScreen';

  function DisplayScreen() {
    return {
      element: element,
      name: element.id,
      width: screenWidth,
      height: screenHeight,
      center: physics.vector( screenWidth, screenHeight ).mult( 0.5 ) 
    };
  }

  _root.display.modules.screen = DisplayScreen;
})();
