describe("MemberController", function() {
  describe("#create", function() {
    var radar, store, data, display, group, member, memberData, memberBody;

    beforeAll( function() {
      radar = new Radar();
      store = radar.storeController;
      data = DATA.foo;
      display = radar.display;
    });

    it("adds a new member to the store", function() {
      memberData = data.members[0];

      expect( store.get( memberData.member, memberData.group ) ).not.toBeDefined();
      store.update( memberData );

      group = store.get( data.group );
      member = store.get( memberData.member, group );

      expect( member ).toBeDefined();
    });

    it("assigns the member properties on the new member", function() {
      expect( member.id ).toEqual( memberData.member );
      expect( member.group ).toEqual( memberData.group );
      expect( member.state ).toEqual( memberData.state );
    });

    it("creates a new member body in the display", function() {
      memberData = data.members[1];

      expect( display.findOne({ id: memberData.memberi, entity: 'member' }) ).toBeFalsy();

      store.update( memberData );

      expect( display.findOne({ id: memberData.member, entity: 'member' }) ).not.toBeFalsy();
    });

    it("stores a reference of the member body against the member object", function() {
      memberBody = display.findOne({ id: memberData.member, entity: 'member' });
      member = store.get( memberData.member, group );

      expect( member.body ).toEqual( memberBody );
    });
  });

  describe("#read", function() {
    var radar, store, data, group, member, memberData;

    beforeAll( function() {
      radar = new Radar();
      store = radar.storeController;
      data = DATA.foo;
      memberData = data.members[0];
    });

    it("returns undefined if requested member does not exist", function() {
      expect( store.get( memberData.member, data.group ) ).not.toBeDefined();
    });

    it("returns the member object if it exists", function() {
      store.update( memberData );

      group = store.get( data.group );
      member = store.get( memberData.member, group );

      expect( member.id ).toEqual( memberData.member );
      expect( member.group ).toEqual( memberData.group );
      expect( member.state ).toEqual( memberData.state );
    });
  });

  describe("#update", function() {
    var radar, store, data, group, member, memberData;

    beforeAll( function() {
      radar = new Radar();
      store = radar.storeController;
      data = DATA.foo;
      memberData = data.members[0];
    });

    it("sets the member state for a new member", function() {
      expect( store.get( memberData.member, data.group ) ).not.toBeDefined();

      memberData.state.foo = false;

      store.update( memberData );

      group = store.get( data.group );

      expect( store.get( memberData.member, group ).state.foo ).toBeFalsy();
    });

    it("updates the state of an existing member", function() {
      expect( store.get( memberData.member, data.group ) ).toBeDefined();
      
      memberData.state.foo = true;

      store.update( memberData );

      expect( store.get( memberData.member, group ).state.foo ).toBeTruthy();
    });

    it("retains existing member state data if it is not referenced in an update", function() {
      expect( store.get( memberData.member, group ).state.foo ).toEqual( true );

      memberData.state = {
        bar: "Another Property"
      };

      store.update( memberData );

      expect( store.get( memberData.member, group ).state.foo ).toEqual( true );
      expect( store.get( memberData.member, group ).state.bar ).toBe( "Another Property" );
    });
  });
});
