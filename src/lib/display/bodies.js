(function() {

  var bodies = _root.display.bodies;

  function DisplayBodies() {
    return {
      group: bodies.group,
      member: bodies.member
    };
  }

  _root.display.modules.bodies = DisplayBodies;

})();
