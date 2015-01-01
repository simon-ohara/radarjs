describe("MemberBehavior", function() {
  var radar, store, display, behaviors, numBehaviors;

  function reinitializeInstance() {
    radar = new Radar();
    store = radar.storeController;
    display = radar.display;
    behaviors = display.getBehaviors();
    numBehaviors = behaviors.length;
  }

  describe("#connect", function() {
    
  });
});
