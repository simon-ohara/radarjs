(function() {
  // The model representing group objects
  //
  // can be instantiated in the following ways
  //
  // var group;
  //
  // group = new GroupModel();
  // group.id === undefined   >> true
  // group.members === []     >> true
  //
  // group = new GroupModel( "groupId" );
  // group.id === "groupId"   >> true
  // group.members === []     >> true
  //
  // group = new GroupModel({ id: "groupId" });
  // group.id === "groupId"   >> true
  // group.members === []     >> true
  //
  // group = new GroupModel( "groupId", [1,2,3] );
  // group.id === "groupId"     >> true
  // group.members === [1,2,3]  >> true
  //
  // group = new GroupModel({ id: "groupId", members: [1,2,3] });
  // group.id === "groupId"     >> true
  // group.members === [1,2,3]  >> true
  //
  // group = new GroupModel([1,2,3]);
  // group.id === undefined     >> true
  // group.members === [1,2,3]  >> true
  //
  function GroupModel() {
    var data = arguments[0];

    // Defaults
    this.id = undefined;
    this.members = [];

    // Assess the first argument
    if( data ) {
      if( typeof data === 'string' ) {
        this.id = data;
      } else if( data instanceof Array ) {
        this.members = data;
      } else {
        // It might be an object
        // Look for corresponding keys and assign appropriately
        if( data.id ) { this.id = data.id; }
        if( data.members ) { this.members = data.members; }
      } 
    }

    // Assign the second argument if it is an array
    if( arguments[1] instanceof Array ) {
      this.members = arguments[1];
    }
  }

  // Export to the package-root models object
  _root.models.group = GroupModel;
})();
