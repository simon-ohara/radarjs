describe("GroupController", function() {
  describe("#create", function() {
    var radar, store, subject, display, data, group, groupBody;

    beforeEach( function() {
      radar = new Radar();
      store = radar.storeController;
      subject = radar.groupController;
      display = radar.display;
      data = DATA.foo;
    });

    it("adds a new group to the store", function() {
      expect( store.get( data.group ) ).not.toBeDefined();
      subject.create( data.group );
      group = store.get( data.group );
      expect( group ).toBeDefined();
    });

    it("assigns the group id on the new group", function() {
      subject.create( data.group );
      group = store.get( data.group );
      expect( group.id ).toEqual( data.group );
    });

    it("adds a new group body to the display", function() {
      expect( display.findOne({ id: data.group, entity: 'group' }) ).toBeFalsy();

      subject.create( data.group );

      expect( display.findOne({ id: data.group, entity: 'group' }) ).not.toBeFalsy();
    });

    it("stores a reference of the group body against the group object", function() {
      group = subject.create( data.group );
      groupBody = display.findOne({ id: data.group, entity: 'group' });

      expect( group.body ).toEqual( groupBody );
    });
  });

  describe("#read", function() {
    var radar, store, subject, data, group;

    beforeEach( function() {
      radar = new Radar();
      store = radar.storeController;
      subject = radar.groupController;
      display = radar.display;
      data = DATA.foo;
    });

    it("returns undefined if requested group does not exist", function() {
      expect( subject.read( data.group ) ).not.toBeDefined();
    });

    it("returns the group object if it exists", function() {
      subject.create( data.group );

      group = subject.read( data.group );

      expect( group.id ).toEqual( data.group );
      expect( group.members.length ).toEqual( 0 );
    });
  });

  describe("#check", function() {
    var radar, store, subject, data, group;

    beforeEach( function() {
      radar = new Radar();
      store = radar.storeController;
      subject = radar.groupController;
      display = radar.display;
      data = DATA.foo;
    });

    it("is defined", function() {
      expect( subject.check ).toBeDefined();
    });
    
  });
});
