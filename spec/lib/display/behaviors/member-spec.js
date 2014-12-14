xdescribe("Member Behaviors", function() {
  var radar = new Radar(),
      store = radar.store,
      display = radar.display;

  describe("adding a member to the store", function() {
    it("adds a member body to the display", function() {
      var memberBodies, memberId = "BetaMember",
          numBodiesInitial = display._bodies.length;

      store.update({ group: "BetaGroup", member: memberId, state: {} });
      memberBodies = display.find({ entity: 'member' });

      expect(memberBodies.length).toEqual(1);
      expect(memberBodies[0].uid).toBe(memberId);
    });

    it("notifies the display", function() {
      var groupId = "BetaGroupBeta",
          memberId = "BetaMemberBeta";
      spyOn( display, 'emit' ).and.callThrough();
      store.update({ group: groupId, member: memberId, state: {} });
      expect(display.emit).toHaveBeenCalledWith('display:member:added', memberId );
    });

    it("saves a reference to the store", function() {
      var member,
          groupId = "NewFooGroup",
          memberId = "NewFooMember";

      store.update({ group: groupId, member: memberId, state: {} });
      member = store.get( groupId, memberId );

      expect( member.body ).toBeDefined();
    });
  });

  describe("updating a member in the store", function() {
    it("notifies the display", function() {
      var groupId = "BetaGroupBeta",
          memberId = "BetaMemberBeta";

      spyOn( display, 'emit' ).and.callThrough();
      store.update({ group: groupId, member: memberId, state: { status: "Foo" } });

      expect(display.emit).toHaveBeenCalledWith( 'display:member:updated', memberId );
    });
  });
});
