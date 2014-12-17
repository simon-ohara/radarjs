describe('StoreController', function() {
  var radar = new Radar(),
      subject = radar.storeController,
      exampleData = DATA.foo.members[0];

  describe("#update", function() {
    var newGroupData = DATA.bar.members[0],
        newMemberData = DATA.bar.members[1];

    it("is defined", function() {
      expect(subject.update).toBeDefined();
    });

    it("always returns the updated member object from the store", function() {
      var updatedGroupMember = subject.update( exampleData );

      expect( updatedGroupMember.id ).toEqual( exampleData.member );
      expect( updatedGroupMember.group ).toEqual( exampleData.group );
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

      it("returns a member object when passed a string and a group object as arguments", function() {
        var groupObject = subject.get( exampleData.group ),
            retrievedMember = subject.get( exampleData.member, groupObject );

        expect( retrievedMember.id ).toBe( exampleData.member );
      });

      it("returns undefined when passed a string id for a member that does not exist", function() {
        var nonMember = subject.get( "This Member does not exist", exampleData.group );

        expect( nonMember ).not.toBeDefined();
      });
    });
  });
});
