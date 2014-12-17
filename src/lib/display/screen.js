(function() {

  var element = _dom.createElement('canvas');
  element.id = 'RadarScreen';

  function DisplayScreen() {
    return {
      element: element,
      name: element.id,
      width: _global.innerWidth,
      height: _global.innerHeight
    };
  }

  _root.display.modules.screen = DisplayScreen;
})();
