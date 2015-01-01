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
    var b, behaviorNames, name;

    beforeEach( function() {
      reinitializeInstance();
      behaviorNames = [];

      for( b=0; b<numBehaviors; b++) {
        name = behaviors[b].options.id;
        if( name ) {
          behaviorNames.push( name );
        }
      }
    });

    it("it adds the member boby-impulse-behavior", function() {
      expect( behaviorNames.indexOf('member:impulse') ).toBeGreaterThan(-1);
    });

    it("it adds the member sweep-prune behavior", function() {
      expect( behaviorNames.indexOf('member:sweep') ).toBeGreaterThan(-1);
    });
    
    it("it adds the member body-collision behavior", function() {
      expect( behaviorNames.indexOf('member:collision') ).toBeGreaterThan(-1);
    });
  });

  describe("#on", function() {
    describe("display:member:added", function() {
      beforeEach( function() {
        reinitializeInstance();
      });

      it("applies all behaviors to each new member", function() {
        function expectNumBehaviorTargetsToBe( num ) {
          for( var b=0; b<numBehaviors; b++) {
            // Only look at the behaviors where the id is prefixed with 'member:'
            if( behaviors[b].options.id.match(/^member:/) ) {
              expect( behaviors[b].getTargets().length ).toBe( num );
            }
          }
        }

        // Add a new mwmber to the display
        store.update( DATA.foo.members[0] );
        expectNumBehaviorTargetsToBe( 1 );

        // Add another new member to the display
        store.update( DATA.foo.members[1] );
        expectNumBehaviorTargetsToBe( 2 );
      });

      it("applies the members' group member attractor to the new member", function() {
        var newMember, groupId, attractor, attractorTargets;

        newMember = store.update( DATA.foo.members[0] );
        groupId = newMember.group;
        attractor = display.findBehaviorById('member:attractor:' + groupId);
        attractorTargets = attractor.getTargets();

        expect( attractorTargets.length ).toEqual( 1 );
        expect( attractorTargets[0] ).toBe( newMember.body );
      });
    });
  });
});
