describe("GroupModel", function() {
  var radar = new Radar(),
      subject = radar.models.group,
      group, groupId, groupMembers, model;

  it("is a GroupModel object", function() {
    model = new subject();
    expect(typeof model).toBe('object');
    expect(model.constructor.name).toBe('GroupModel');
  });

  it("has an empty members array", function() {
    group = new subject();
    expect(group.members instanceof Array).toBe(true);
    expect(group.members.length).toEqual(0);
  });

  describe("id", function() {
    beforeAll( function() {
      groupId = "Foo";
    });

    it("can be set with a string when passed as the first param" , function() {
      group = new subject(groupId);

      expect(group.id).toEqual( groupId );
    });

    it("can be set with the id key of an object passed as the first param", function() {
      group = new subject({ id: "Foo" });

      expect(group.id).toEqual( groupId );
    });
  });

  describe("members", function() {
    beforeEach( function() {
      groupMembers = ["Foo", "Bar", "Baz"];
    });

    it("can be set to an array passed as the first param", function() {
      group = new subject( groupMembers );

      expect(group.members).toEqual( groupMembers );
    });

    it("can be set to an array passed as the members key of an object", function() {
      group = new subject({ members: groupMembers });

      expect(group.members).toEqual( groupMembers );
    });

    it("can be set to an array passed as the second argument", function() {
      group = new subject("Foo", groupMembers);

      expect(group.members).toEqual( groupMembers );
    });
  });
});
