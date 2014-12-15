(function() {

  var store = _root.store,
      Group = _root.models.group;

  function GroupModelService() {
    return {

      create: function( groupId ) {
        var newGroup = new Group( groupId );
        store.groups.push( newGroup );

        return newGroup;
      },

      read: function( groupId ) {
        var idx, radar = this,
            groups = store.groups,
            totalGroups = groups.length,
            group = undefined;

        if( groupId ) {
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

  _root.modules.groupModelService = GroupModelService;

})();
