(function() {
  var BaseBody = _root.display.bodies.base,

  options = {
    x: 0,
    y: 0,
    radius: 5,
    mass: 100,
    styles: {
      fillStyle: 'rgba(46, 204, 113, 1)'
    }
  };

  function MemberBody( memberId ) {
    this.entity = 'member';
    this.id = memberId;
    this.__proto__ = new BaseBody( options ); 
  }

  _root.display.bodies.member = MemberBody;

})();
