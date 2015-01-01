describe("GroupBehavior", function() {
  var radar, store, display, behaviors, numBehaviors;

  function reinitializeInstance() {
    radar = new Radar();
    store = radar.storeController;
    display = radar.display;
    behaviors = display.getBehaviors();
    numBehaviors = behaviors.length;
  }

  // #connect
  // #disconnect
  // #behave
  // on 'display:group:added'

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

    it("it adds a point of gravity to the world", function() {
      expect( behaviorNames.indexOf('group:attractor') ).toBeGreaterThan(-1);
    });

    it("it adds the group boby-impulse-behavior", function() {
      expect( behaviorNames.indexOf('group:impulse') ).toBeGreaterThan(-1);
    });

    it("it adds the group sweep-prune behavior", function() {
      expect( behaviorNames.indexOf('group:sweep') ).toBeGreaterThan(-1);
    });

    it("it adds the group body-collision-behavior", function() {
      expect( behaviorNames.indexOf('group:collision') ).toBeGreaterThan(-1);
    });
  });

  describe("#on - 'display:group:added'", function() {
    beforeEach( function() {
      reinitializeInstance();
    });

    it("applies all behaviors to each new group", function() {
      function expectNumBehaviorTargetsToBe( num ) {
        for( var b=0; b<numBehaviors; b++) {
          // Only look at the behaviors where the id is prefixed with 'group:'
          if( behaviors[b].options.id.match(/^group:/) ) {
            expect( behaviors[b].getTargets().length ).toBe( num );
          }
        }
      }

      // Add a new group to the display
      store.update( DATA.foo.members[0] );
      expectNumBehaviorTargetsToBe( 1 );

      // Add another new group to the display
      store.update( DATA.bar.members[0] );
      expectNumBehaviorTargetsToBe( 2 );
    });

    describe("member attractor", function() {
      var memberAttractors;

      beforeEach( function() {
        memberAttractors = [];
        store.update( DATA.foo.members[0] );

        behaviors = display.getBehaviors();
        numBehaviors = behaviors.length;

        for( var b=0; b<numBehaviors; b++ ) {
          if( behaviors[b].options.id.match(/^member:attractor:/) ) {
            memberAttractors.push( behaviors[b] );
          }
        }
      });

      it("adds a member attractor to the display", function() {
        expect( memberAttractors.length ).toBe( 1 );
      });

      it("names the member attractor by suffixing the id", function() {
        expect( memberAttractors[0].options.id ).toBe('member:attractor:'+DATA.foo.group);
      });

      it("sets the position of the attractor to that of the group", function() {
        var group = display.findOne({ id: DATA.foo.group });

        expect( memberAttractors[0]._pos.x ).toEqual( group.state.pos.x );
        expect( memberAttractors[0]._pos.y ).toEqual( group.state.pos.y );
      });

      // Looks like this cant be done as the memners dont exist at the point
      // of adding the attractor to the display/group
      // It may work better if each member could add/remove itself from
      // the attractor
      it("applies the attractor to nothing", function() {
        expect( memberAttractors[0].getTargets().length ).toBe( 0 );
      });
    });

    describe("member containment", function() {
      var memberContainers; 

      beforeEach( function() {
        memberContainers = [];
        store.update( DATA.foo.members[0] );

        behaviors = display.getBehaviors();
        numBehaviors = behaviors.length;

        for( var b=0; b<numBehaviors; b++ ) {
          if( behaviors[b].options.id.match(/^member:containment:/) ) {
            memberContainers.push( behaviors[b] );
          }
        }
      });

      it("adds a member containment to the display", function() {
        expect( memberContainers.length ).toBe( 1 );
      });

      it("names the member containment by suffixing the id", function() {
        expect( memberContainers[0].options.id ).toBe('member:containment:'+DATA.foo.group);
      });

      it("applies the containment behavior to nothing", function() {
        expect( memberContainers[0].getTargets().length ).toBe( 0 );
      });
    });
  });
});
