describe('StoreController', function() {

  describe("#update", function() {
    var radar, groups, members, subject, data, existingGroup;

    beforeEach( function() {
      data = DATA.foo;
      existingGroup = DATA.bar;

      radar = new Radar();
      subject = radar.storeController;
      groups = radar.groupController;
      members = radar.memberController;

      subject.update( existingGroup.members[0] );

      spyOn( groups, 'read' ).and.callThrough();
      spyOn( groups, 'create' ).and.callThrough();
      spyOn( members, 'read' ).and.callThrough();
      spyOn( members, 'create' ).and.callThrough();
    });

    it("calls #get and then #add for groups that do no exist", function() {
      subject.update( data.members[0] );

      // From #get
      expect( groups.read ).toHaveBeenCalledWith( data.group );
      // From #add
      expect( groups.create ).toHaveBeenCalledWith( data.group );
    });

    it("calls #get and then #add for members that do not exist", function() {
      subject.update( data.members[0] );

      // From #get
      expect( members.read ).toHaveBeenCalledWith( data.members[0].member );
      // From #add
      expect( members.create ).toHaveBeenCalledWith( data.members[0].member, data.group );
    });

    it("calls #get but not create for existing groups", function() {
      subject.update( existingGroup.members[1] );

      // From #get
      expect( groups.read ).toHaveBeenCalledWith( existingGroup.group );
      // From #add
      expect( groups.create ).not.toHaveBeenCalled();
    });

    it("calls #get but not create for existing groups", function() {
      subject.update( existingGroup.members[0] );

      // From #get
      expect( members.read ).toHaveBeenCalledWith( existingGroup.members[0].member );
      // From #add
      expect( members.create ).not.toHaveBeenCalled();
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
    var radar, groups, members, subject, data, existingGroup;

    beforeEach( function() {
      data = DATA.foo;
      existingGroup = DATA.bar;

      radar = new Radar();
      subject = radar.storeController;
      groups = radar.groupController;
      members = radar.memberController;

      subject.update( data.members[0] );

      spyOn( groups, 'read' ).and.callThrough();
      spyOn( groups, 'create' ).and.callThrough();
      spyOn( members, 'read' ).and.callThrough();
      spyOn( members, 'create' ).and.callThrough();
    });

    describe("groups", function() {
      it("calls #read on the memberController", function() {
        subject.get( data.group );

        expect( members.read ).toHaveBeenCalledWith( data.group );
      });

      it("calls #read on the groupController", function() {
        subject.get( data.group );

        expect( groups.read ).toHaveBeenCalledWith( data.group );
      });
    });

    describe("members", function() {
      it("calls #read on the memberController", function() {
        subject.get( data.members[0].member );

        expect( members.read ).toHaveBeenCalledWith( data.members[0].member );
      });

      it("does not call #read on the groupController", function() {
        subject.get( data.members[0].member );

        expect( groups.read ).not.toHaveBeenCalled();
      });
    });
  });

  describe("#remove", function() {
    var radar, member, members, subject, data;

    beforeEach( function() {
      data = DATA.foo;

      radar = new Radar();
      subject = radar.storeController;
      members = radar.memberController;

      spyOn( members, 'destroy' ).and.callThrough();
    });

    it("calls #destroy on the member controller", function() {
      member = subject.update( data.members[0] ); 
      subject.remove( member );

      expect( members.destroy ).toHaveBeenCalled();
    });
  });
});
