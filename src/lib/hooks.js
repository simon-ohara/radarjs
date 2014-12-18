(function() {
  function RadarHooks() {
    var h, hooks = _root.hooks,
        radarHooks = {};

    for( h in hooks ) {
      radarHooks[ h ] = hooks[ h ];
    }

    return radarHooks;
  }

  _root.modules.on = RadarHooks;
})();
