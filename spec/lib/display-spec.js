describe("RadarDisplay", function() {
  var radar = new Radar(),
      subject = radar.display;

  it("inherits the Physics.world instance", function() {
    // this can be confirmed by checking there is a circular reference in the integrator
    expect(subject._integrator._world).toBeDefined();
  });

  describe("its renderer", function() {
    it("exists", function() {
      expect(subject._renderer).not.toBe(null);
    });

    it("targets the radar screen property to render to", function() {
      expect(subject._renderer.el.id).toEqual(subject.screen.name);
    });

    it("sets its width to the radar screen width", function() {
      expect(subject._renderer.options.width).toEqual(subject.screen.width);
    });

    it("sets its height to the radar screen height", function() {
      expect(subject._renderer.options.height).toEqual(subject.screen.height);
    });
  });

  describe("its behaviors", function() {
    var b, behaviors, numBehaviors, behaviorNames, name;

    beforeEach( function() {
      behaviors = subject.getBehaviors();
      numBehaviors = behaviors.length;
      behaviorNames = [];

      for( b=0; b<numBehaviors; b++ ) {
        name = behaviors[b].options.id;
        if( name ) {
          behaviorNames.push( name );
        } 
      }
    });

    it("are present", function() {
      expect(behaviors.length).toBeGreaterThan(0);
    });

    it("include 'display:group'", function() {
      expect(behaviorNames.indexOf('display:group')).toBeGreaterThan(-1);
    });

    it("include 'display:member'", function() {
      expect(behaviorNames.indexOf('display:member')).toBeGreaterThan(-1);
    });
  });

  describe("#findAll", function() {
    it("returns an array of all group bodies when passed the param of 'groups'", function() {
      radar.storeController.update( DATA.foo.members[0] );
      var groups = subject.findAll('group');

      expect( groups ).toEqual( subject.find({ entity: 'group' }) );
    });

    it("returns an array of all member bodies when passed the param of 'members'", function() {
      radar.storeController.update( DATA.foo.members[0] );
      var members = subject.findAll('member');

      expect( members ).toEqual( subject.find({ entity: 'member' }) );
    });
  });

  describe("#findMembersOfGroup", function() {
    it("returns all member bodies of a given group", function() {
      radar.storeController.update( DATA.foo.members[0] );
      var members = subject.findMembersOfGroup( DATA.foo.group );

      expect( members.length ).toBeGreaterThan( 0 );
      expect( members ).toEqual( subject.find({ entity: 'member', group: DATA.foo.group }) );
    });
  });
});
