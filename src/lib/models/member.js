(function() {
  // The model representing member objects
  //
  // It can be instantiated in the following ways
  //
  // var member;
  //
  // member = new MemberModel();
  // member.id === undefined;
  // member.group === undefined;
  // member.state === {};
  //
  // member = new MemberModel("memberId");
  // member.id === "memberId";
  // member.group === undefined;
  // member.state === {};
  //
  // member = new MemberModel("memberId", "groupId");
  // member.id === "memberId";
  // member.group === "groupId";
  // member.state === {};
  //
  // member = new MemberModel("memberId", "groupId", { foo: "Foo Value" });
  // member.id === "memberId";
  // member.group === "groupId";
  // member.state === { foo: "Foo Value" };
  //
  // member = new MemberModel({ id: "memberId", group: "groupId", state: { foo: "Foo Value " } });
  // member.id === "memberId";
  // member.group === "groupId;
  // member.state === { foo: "Foo Value" };
  //
  function MemberModel() {
    var data = arguments[0],
        groupId = arguments[1],
        stateData = arguments[2];

    // Defaults
    this.id = undefined;
    this.group = undefined;
    this.state = {};

    // Assess the first argument
    if( data ) {
      if( typeof data === 'string' ) {
        this.id = data;
      } else {
        // It might be an object
        // Look for corresponding keys and assign appropriately
        if( data.id ) { this.id = data.id; }
        if( data.group ) { this.group = data.group; }
        if( data.state ) { this.state = data.state; }
      }
    }

    // If there is a second argument it should be the groupId
    if( groupId && typeof groupId === 'string' ) {
      this.group = groupId;
    }

    // If there is a third argument it should be a state object
    if( stateData && typeof stateData === 'object' && stateData instanceof Object ) {
      this.state = stateData;
    }

  }

  _root.models.member = MemberModel;
})();
