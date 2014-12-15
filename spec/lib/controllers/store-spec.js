describe('StoreController', function() {
  var radar = new Radar(),
      subject = radar.storeController,
      exampleData = {
        member: "38df4002e7aa7295ae3027b04dd8864a_oneapp_1",
        group: "38df4002e7aa7295ae3027b04dd8864a",
        state: {
          status: "waiting"
        }
      };

  describe("#update", function() {
    var newGroupData = {
          member: "FooMember",
          group: "FooGroup",
          state: {}
        },
        newMemberData = {
          member: "BarMember",
          group: newGroupData.group,
          state: {}
        };

    it("is defined", function() {
      expect(subject.update).toBeDefined();
    });

    it("returns the updated member object from the store", function() {
      var updatedGroupMember = subject.update( exampleData );

      expect( updatedGroupMember.id ).toEqual( exampleData.member );
      expect( updatedGroupMember.group ).toEqual( exampleData.group );
    });

    it("creates the group if it does not exist", function() {
      // Group does not exist
      expect( subject.get( newGroupData.group ) ).not.toBeDefined();
      // After updating
      subject.update( newGroupData );
      // Group does exist
      expect( subject.get( newGroupData.group ) ).toBeDefined();
    });

    it("creates the member if it does not exist", function() {
      // Group exists
      expect( subject.get( newMemberData.group ) ).toBeDefined();
      // Member does not exist
      expect( subject.get( newMemberData.member, newMemberData.group ) ).not.toBeDefined();
      // After updating the group
      subject.update( newMemberData );
      // The Member now exists
      expect( subject.get( newMemberData.member, newMemberData.group ) ).toBeDefined();
    });

    describe("argument validation", function() {
      var invalidArgType = "This is an Invalid Argument Type",
          invalidArgStructures = [
            { foo: "no valid properties" },
            { member: "one valid property" },
            { member: "two valid properties", group: "this is the other one" }
          ];

      it("throws an error if it is falsy", function() {
        expect(function() {
          subject.update();
        }).toThrow();
      });

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
  });

  describe("#get", function() {
    beforeAll( function() {
      subject.update( exampleData );
    });

    describe("groups", function() {
      it("returns a single group object when passed a string of an existing groups id", function() {
        var retrievedGroup = subject.get( exampleData.group );

        expect( retrievedGroup.id ).toBe( exampleData.group );
      });

      it("returns undefined when passed a string of an id for a gorup that does not exist", function() {
        var nonGroup = subject.get( "This Group doesn't exist!" );

        expect( nonGroup ).not.toBeDefined();
      });
    });

    describe("members", function() {
      it("returns a member object when passed two strings as arguments", function() {
        var retrievedMember = subject.get( exampleData.member, exampleData.group );

        expect( retrievedMember.id ).toBe( exampleData.member );
      });

      it("returns undefined when passed a string id for a member that does not exist", function() {
        var nonMember = subject.get( "This Member does not exist", exampleData.group );

        expect( nonMember ).not.toBeDefined();
      });
    });
  });
});
