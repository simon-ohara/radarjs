describe("MemberController", function() {
  describe("#create", function() {
    var radar, store, data, subject, display, groups, group, member, memberData, memberBody;

    beforeEach( function() {
      radar = new Radar();
      store = radar.storeController;
      groups = radar.groupController;
      display = radar.display;
      subject = radar.memberController;
      data = DATA.foo;
      memberData = data.members[0];

      groups.create( data.group );
    });

    it("adds a new member to the store", function() {
      expect( store.get( memberData.member, data.group ) ).not.toBeDefined();

      subject.create( memberData.member, data.group );

      expect( store.get( memberData.member, data.group ) ).toBeDefined();
    });

    it("assigns the member properties on the new member", function() {
      member = subject.create( memberData.member, data.group );
      expect( member.id ).toEqual( memberData.member );
      expect( member.group ).toEqual( memberData.group );
      expect( member.state ).toEqual( memberData.state );
    });

    it("creates a new member body in the display", function() {
      expect( display.findOne({ id: memberData.member, entity: 'member' }) ).toBeFalsy();

      subject.create( memberData.member, data.group );

      expect( display.findOne({ id: memberData.member, entity: 'member' }) ).not.toBeFalsy();
    });

    it("sets the member body position to that of its group body parent", function() {
      group = store.get( data.group );
      member = subject.create( memberData.member, data.group );

      expect( member.body.state.pos.x ).toEqual( group.body.state.pos.x - (group.body.radius / 2) );
      expect( member.body.state.pos.y ).toEqual( group.body.state.pos.y - (group.body.radius / 2) );
    });

    it("stores a reference of the group on the body", function() {
      subject.create( memberData.member, data.group );

      expect( display.findOne({ id: memberData.member, entity: 'member' }).group ).toBe( data.group );
    });

    it("stores a reference of the member body against the member object", function() {
      member = subject.create( memberData.member, data.group );
      memberBody = display.findOne({ id: memberData.member, entity: 'member' });

      expect( member.body ).toEqual( memberBody );
    });

    it("notifies the display of the addition", function() {
      spyOn( display, 'emit' );
      member = subject.create( memberData.member, data.group );

      expect( display.emit.calls.mostRecent().args ).toEqual([ 'display:member:added',  member ]);
    });
  });

  describe("#read", function() {
    var radar, store, data, subject, groups, member, memberData;

    beforeEach( function() {
      radar = new Radar();
      store = radar.storeController;
      groups = radar.groupController;
      subject = radar.memberController;
      data = DATA.foo;
      memberData = data.members[0];

      groups.create( data.group );
    });

    it("returns undefined if requested member does not exist", function() {
      expect( subject.read( memberData.member, data.group ) ).not.toBeDefined();
    });

    it("returns the member object if it exists", function() {
      subject.create( memberData.member, data.group );
      member = subject.read( memberData.member, data.group );

      expect( member.id ).toEqual( memberData.member );
      expect( member.group ).toEqual( memberData.group );
      expect( member.state ).toEqual( memberData.state );
    });
  });

  describe("#update", function() {
    var radar, store, subject, data, groups, member, memberData, newState, oldState;

    beforeEach( function() {
      radar = new Radar();
      store = radar.storeController;
      groups = radar.groupController;
      subject = radar.memberController;
      data = DATA.foo;
      memberData = data.members[0];
      newState = {
        a: "ThisIsTheFirst",
        b: "ThisIsTheSecond"
      };

      groups.create( data.group );
    });

    it("updates the state of an existing member", function() {
      member = subject.create( memberData.member, data.group );
      subject.update( member, { foo: newState.a } );
      expect( member.state.foo ).toEqual( newState.a );

      subject.update( member, { foo: newState.b } );
      expect( member.state.foo ).toEqual( newState.b );
    });

    it("retains existing member state data if it is not referenced in an update", function() {
      member = subject.create( memberData.member, data.group );
      subject.update( member, { foo: newState.a } );
      subject.update( member, { bar: newState.b } );

      expect( member.state.foo ).toEqual( newState.a );
      expect( member.state.bar ).toEqual( newState.b );
    });
    
    it("triggers a life-cycle hook", function() {
      spyOn( radar.on, 'memberChangeState' );
      member = subject.create( memberData.member, data.group );
      oldState = member.state;
      subject.update( member, { foo: newState.a } );

      expect( radar.on.memberChangeState ).toHaveBeenCalledWith( member, oldState );
    });
  });

  describe("#destroy", function() {
    var radar, store, subject, data, display, groups, member, memberData;

    beforeEach( function() {
      radar = new Radar();
      store = radar.storeController;
      groups = radar.groupController;
      subject = radar.memberController;
      display = radar.display;
      data = DATA.foo;
      memberData = data.members[0];

      spyOn( groups, 'check' );
      groups.create( data.group );
      member = subject.create( memberData.member, data.group );
      subject.destroy( member );
    });

    it("removes the referenced members body from the display", function() {
      expect( display.findOne({ id: member.id, entity: 'member' }) ).toBeFalsy();
    });

    it("removes the referenced member from the store", function() {
      expect( store.get( member.id, data.group ) ).not.toBeDefined();
    });

    it("asks the parent group to run a check on member numbers", function() {
      expect( groups.check ).toHaveBeenCalled();
    });
  });
});
