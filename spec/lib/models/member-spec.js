describe("MemberModel", function() {
  var radar = new Radar(),
      subject = radar.models.member,
      memberId = "Foo",
      groupId = "Bar",
      stateData = { foo: "Foo Value", bar: "Bar Value" },
      member, model;

  it("is a MemberModel object", function() {
    model = new subject();
    expect(typeof model).toBe('object');
    expect(model.constructor.name).toBe('MemberModel');
  });

  it("has an empty state object", function() {
    member = new subject();
    expect(member.state instanceof Object).toBe(true);
    expect(typeof member.state).toBe('object');
    expect(Object.keys(member.state).length).toBe(0);
  });

  describe("id", function() {
    it("can be set with a string when passed as the first param" , function() {
      member = new subject(memberId);

      expect(member.id).toEqual( memberId );
    });

    it("can be set with the id key of an object passed as the first param", function() {
      member = new subject({ id: memberId });

      expect(member.id).toEqual( memberId );
    });
  });

  describe("group", function() {
    it("can be set with a string when passed as the second param" , function() {
      member = new subject(memberId, groupId);

      expect(member.group).toEqual( groupId );
    });

    it("can be set with the id key of an object passed as the first param", function() {
      member = new subject({ group: groupId });

      expect(member.group).toEqual( groupId );
    });
  });

  describe("state", function() {
    it("can be set with an object when passed as the third param", function() {
      member = new subject(memberId, groupId, stateData);

      expect(member.state).toBe( stateData );
    });

    it("can be set with an object passed as the state key of an object", function() {
      member = new subject({ state: stateData });

      expect(member.state).toEqual( stateData );
    });
  });
});
