describe("RadarDisplay", function() {
  var radar = new Radar(),
      subject = radar.display;

  it("inherits the Physics.world instance", function() {
    // this can be confirmed by checking there is a circular reference in the integrator
    expect(subject._integrator._world).toEqual(subject.__proto__);
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
    it("are present", function() {
      expect(subject._behaviors.length).toBeGreaterThan(0);
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

      expect( members ).toEqual( subject.find({ entity: 'member', group: DATA.foo.group }) );
    });
  });
});
