xdescribe("Group Behaviors", function() {
  var radar = new Radar(),
      store = radar.store,
      display = radar.display;

  describe("adding a group to the store", function() {
    it("adds a group body to the display", function() {
      var groupBodies, groupId = "New Group",
          numBodiesInitial = display._bodies.length;

      store.update({ group: groupId, member: "New Member", state: {} });

      expect(display._bodies.length).toBeGreaterThan( numBodiesInitial );

      groupBodies = display.find({ entity: 'group' });
      expect(groupBodies.length).toEqual(1);
      expect(groupBodies[0].uid).toBe(groupId);
    });

    it("notifies the display", function() {
      var groupId = "Another Group";
      spyOn( display, 'emit' ).and.callThrough();
      store.update({ group: groupId, member: "New Member", state: {} });
      expect(display.emit).toHaveBeenCalledWith('display:group:added', groupId );
    });

    it("saves a reference to the store", function() {
      var group, groupBody, groupId = "Foo Group";
      store.update({ group: groupId, member: "New Member", state: {} });
      group = store.get( groupId );
      expect( group.body ).toBeDefined();
    });
  });
});
