(function() {

  var Member = _root.models.member,
      MemberBody = _root.display.bodies.member;

  function MemberController() {
    var store = _root.stores[ this.store ],
        display = this.display,
        groupController = this.groupController;

    store.members = {};

    function addBody( memberId ) {
      var body = new MemberBody( memberId );

      display.addBody( body );

      return body; 
    }

    return {

      create: function( memberId, groupId ) {
        var newMember = new Member( memberId, groupId );
        newMember.body = addBody( memberId );

        store.members[ memberId ] = newMember;
        store.groups[ groupId ].members.push( memberId );

        return newMember;
      },

      read: function( memberId ) {
        return store.members[ memberId ];
      },

      update: function( member, stateData ) {
        for(var prop in stateData) {
          if( stateData.hasOwnProperty( prop ) ) {
            member.state[ prop ] = stateData[ prop ];
          }
        }

        return member;
      },

      destroy: function( member ) {
        var idx, group, members, removed;

        // Remove body from the display
        display.removeBody( member.body );
        
        group = store.groups[ member.group ];
        members = group.members;
        idx = members.indexOf( member );

        // Remove the reference from group members
        removed = members.splice( idx, 1 );
        groupController.check();

        delete store.members[ member.id ];
      }
    };
  }

  _root.modules.memberController = MemberController;

})();
