(function() {

  // The Store Instance
  //
  // The private data object that stores the state of groups and members
  // with references to their display bodies.
  //
  // Radar instances are given a store uid to access it
  //
  function RadarStore() {
    var uid = "store-"+Date.now();

    _root.stores[ uid ] = {};

    return uid;
  }

  _root.modules.store = RadarStore;

})();
