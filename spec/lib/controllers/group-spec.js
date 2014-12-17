describe("GroupController", function() {
  describe("#create", function() {
    var radar, store, display, data, group, groupBody;

    beforeAll( function() {
      radar = new Radar();
      store = radar.storeController;
      display = radar.display;
      data = DATA.foo;
    });

    it("adds a new group to the store", function() {
      expect( store.get( data.group ) ).not.toBeDefined();
      store.update( data.members[0] );

      group = store.get( data.group );

      expect( group ).toBeDefined();
    });

    it("assigns the group id on the new group", function() {
      expect( group.id ).toEqual( data.group );
    });

    it("adds a new group body to the display", function() {
      data = DATA.bar;

      expect( display.findOne({ id: data.group, entity: 'group' }) ).toBeFalsy();

      store.update( data.members[0] );

      expect( display.findOne({ id: data.group, entity: 'group' }) ).not.toBeFalsy();
    });

    it("stores a reference of the group body against the group object", function() {
      groupBody = display.findOne({ id: data.group, entity: 'group' });
      group = store.get( data.group );

      expect( group.body ).toEqual( groupBody );
    });
  });

  describe("#read", function() {
    var radar, store, data, group;

    beforeAll( function() {
      radar = new Radar();
      store = radar.storeController;
      data = DATA.foo;
    });

    it("returns undefined if requested group does not exist", function() {
      expect( store.get( data.group ) ).not.toBeDefined();
    });

    it("returns the group object if it exists", function() {
      store.update( data.members[0] );

      group = store.get( data.group );

      expect( group.id ).toEqual( data.group );
      expect( group.members.length ).toEqual( 1 );
      expect( group.members[0].id ).toEqual( data.members[0].member );
      expect( group.members[0].group ).toEqual( data.members[0].group );
      expect( group.members[0].state ).toEqual( data.members[0].state );
    });
  });
});
