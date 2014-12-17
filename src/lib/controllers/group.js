(function() {

  var Group = _root.models.group,
      GroupBody = _root.display.bodies.group;

  function GroupController() {
    var store = _root.stores[ this.store ],
        display = this.display;

    function addBody( groupId ) {
      var body = new GroupBody( groupId );

      display.addBody( body );

      return body; 
    }

    return {

      create: function( groupId ) {
        var newGroup = new Group( groupId );
        newGroup.body = addBody( groupId );

        store.groups.push( newGroup );

        return newGroup;
      },

      read: function( groupId ) {
        var idx, group,
            groups = store.groups,
            totalGroups = groups.length;

        if( groupId && totalGroups ) {
          for( idx=0; idx<totalGroups; idx++ ) {
            if( groups[ idx ].id === groupId ) {
              group = groups[ idx ];
              break;
            }
          }
        }

        return group;
      },

      update: function() {},

      destroy: function() {}
    };
  }

  _root.modules.groupController = GroupController;

})();
