(function() {

  var Group = _root.models.group,
      GroupBody = _root.display.bodies.group;

  function GroupController() {
    var store = _root.stores[ this.store ],
        display = this.display;

    store.groups = {};

    function addBody( groupId ) {
      var body = new GroupBody( groupId );

      display.addBody( body );

      return body; 
    }

    return {

      create: function( groupId ) {
        var newGroup = new Group( groupId );
        newGroup.body = addBody( groupId );

        store.groups[ groupId ] = newGroup;

        return newGroup;
      },

      read: function( groupId ) {
        return store.groups[ groupId ];
      },

      update: function() {},

      destroy: function() {},

      check: function() {}
    };
  }

  _root.modules.groupController = GroupController;

})();
