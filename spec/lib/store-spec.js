xdescribe('RadarStore', function() {
  var radar = new Radar(),
      subject = radar.store,
      services = radar.services,
      exampleData = {
        member: "38df4002e7aa7295ae3027b04dd8864a_oneapp_1",
        group: "38df4002e7aa7295ae3027b04dd8864a",
        state: {
          status: "waiting"
        }
      };


  it("is an object", function() {
    expect(typeof subject).toBe('object');
  });

  describe("#update", function() {
    it("is defined", function() {
      expect(subject.update).toBeDefined();
    });

    // when a new group is passed
    // when an existing group is passed
    // when a new groupMember is passed
    // when an existing groupMember is passed
    //
    // update data received always describes the state of a single groupMember
    //
    // expected structure of update data
    //  {
    //    name: "38df4002e7aa7295ae3027b04dd8864a_oneapp_1",
    //    status: "waiting",
    //    convoy: "38df4002e7aa7295ae3027b04dd8864a"
    //  }
    describe("argument data validation", function() {
      var invalidArgType = "This is an Invalid Argument Type",
          invalidArgStructures = [
            { foo: "no valid properties" },
            { member: "one valid property" },
            { member: "two valid properties", group: "this is the other one" }
          ];

      it("throws an error if it is not an object", function() {
        expect(function() {
          subject.update( invalidArgType );
        }).toThrowError("Invalid argument type: '" + invalidArgType + "' is not an object.");
      });

      it("throws an error if it does not contain one of the required properties", function() {
        var idx, numInvalidArgStructures = invalidArgStructures.length;

        for( idx=0; idx<numInvalidArgStructures; idx++ ) {
          expect( function() {
            subject.update( invalidArgStructures[ idx ] );
          }).toThrow();
        }
      });
    });

    it("returns the updated groupMember object from the store", function() {
      var updatedGroupMember = subject.update( exampleData );

      expect( updatedGroupMember.uid ).toEqual( exampleData.member );
      expect( updatedGroupMember.group ).toEqual( exampleData.group );
    });

    it("alters the state of an existing member", function() {
      var firstUpdate, secondUpdate,
          groupName = "A Group",
          memberName = "A Member";

      firstUpdate = subject.update({ group: groupName, member: memberName, state: { foo: true } });
      expect( subject.get(groupName, memberName).state.foo ).toBe( true );

      secondUpdate = subject.update({ group: groupName, member: memberName, state: { foo: false } });
      expect( subject.get(groupName, memberName).state.foo ).toBe( false );
    });

    describe("notifying the display", function() {
      beforeEach(function() {
        spyOn(services.display, 'notify').and.callThrough();
      });

      it("happens when a group is added", function() {
        subject.update({ group: "NewGroup", member: "NewMember", state: {} });

        expect(services.display.notify.calls.argsFor(0)).toMatch('store:group:added');
      });

      it("happens when a member is added", function() {
        subject.update({ group: "AlphaGroup", member: "FirstMember", state: {} });
        subject.update({ group: "AlphaGroup", member: "SecondMember", state: {} });

        expect(services.display.notify.calls.argsFor(1)).toMatch('store:member:added');
        expect(services.display.notify.calls.argsFor(3)).toMatch('store:member:added');
      });

      it("happens when a member is updated", function() {
        subject.update({ group: "AlphaGroup", member: "FirstMember", state: { state: "New State" } });

        expect(services.display.notify.calls.argsFor(0)).toMatch('store:member:updated');
      });
    });
  });

  describe("#get", function() {
    beforeAll(function() {
      var grp, m, structure = { Foo: 1, Bar: 5, Baz: 2 };

      // Generate some data in the store
      for( grp in structure ) {
        for( m=1; m<=structure[grp]; m++ ) {
          subject.update({ group: grp+"Group", member: grp+"Member_"+m, state: {} });
        }
      }
    });

    it("is defined", function() {
      expect(subject.get).toBeDefined();
    });

    it("expects atleast one non-falsy param", function() {
      expect(function() { subject.get(); }).toThrow();
      expect(function() { subject.get(null); }).toThrow();
      expect(function() { subject.get(undefined); }).toThrow();
      expect(function() { subject.get(false); }).toThrow();
    });

    describe("groups", function() {
      it("expects a string as the first param for the groupId", function() {
        expect(function() { subject.get(4500); }).toThrow();
        expect(function() { subject.get({}); }).toThrow();
        expect(function() { subject.get(function() {}); }).toThrow();
        expect(function() { subject.get(true) }).toThrow();
        expect(function() { subject.get(''); }).toThrow();

        expect(function() { subject.get('4500'); }).not.toThrow();
      });

      it("returns the requested group based on the passed groupId", function() {
        var expectedGroup = { uid: "FooGroup", members: [ { uid: "FooMember_1", group: "FooGroup", state: {} } ] },
            requestedGroup = subject.get("FooGroup");

        expect(requestedGroup.uid).toEqual( expectedGroup.uid );
        expect(requestedGroup.members[0].uid).toEqual( expectedGroup.members[0].uid );
      });

      it("returns undefined if the group cannot be found", function() {
        expect(subject.get("QuxGroup")).not.toBeDefined();
      });
    });

    describe("members", function() {
      it("expects the second, optional parameter to be a string", function() {
        expect(function() { subject.get("Foo",4500); }).toThrow();
        expect(function() { subject.get("Foo",{}); }).toThrow();
        expect(function() { subject.get("Foo",function() {}); }).toThrow();
        expect(function() { subject.get("Foo",true) }).toThrow();

        expect(function() { subject.get("Foo", "Bar") }).not.toThrow();
      });

      it("returns the requested member based on the passed groupId and memberId", function() {
        var memberId = "BarMember_3", groupId = "BarGroup",
            expectedMember = { uid: memberId, group: groupId, state: {} },
            requestedMember = subject.get( groupId, memberId );

        expect( requestedMember.uid ).toEqual( expectedMember.uid );
        expect( requestedMember.group ).toEqual( expectedMember.group );
      });

      it("returns undefined if the member cannot be found", function() {
        expect(subject.get("BazGroup", "BazMember_3")).not.toBeDefined();
      });
    });
  });
});
