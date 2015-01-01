(function() {
  var BaseBody = _root.display.bodies.base,

  groupRGB = '189, 195, 199',
  options = {
    x: 300,
    y: 300,
    restitution: 0.99,
    radius: 30,
    mass: 4,
    styles: {
      fillStyle: 'rgba(' + groupRGB + ', 0.15)',
      strokeStyle: 'rgba(' + groupRGB + ', 0.1)',
      lineWidth: 15
    }
  };

  function GroupBody( groupId ) {
    this.entity = 'group';
    this.id = groupId;
    this.__proto__ = new BaseBody( options );
  }

  _root.display.bodies.group = GroupBody;

})();
