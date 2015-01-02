(function() {

  var Member = _root.models.member,
      MemberBody = _root.display.bodies.member;

  function MemberController() {
    var radar = this,
        store = _root.stores[ radar.store ],
        display = radar.display,
        groupController = radar.groupController;

    store.members = {};

    function addBody( memberId ) {
      var body = new MemberBody( memberId );

      display.addBody( body );

      return body; 
    }

    function setBodyPosition( member, group ) {
      var position, offset;

      position = group.state.pos;
      offset = group.radius / 2;
      member.state.pos.x = position.x - offset;
      member.state.pos.y = position.y - offset;
    }

    return {

      create: function( memberId, groupId ) {
        var newMember, memberGroup;

        memberGroup = store.groups[ groupId ]; 

        newMember = new Member( memberId, groupId );
        newMember.body = addBody( memberId );
        newMember.body.group = groupId;

        setBodyPosition( newMember.body, memberGroup.body );

        store.members[ memberId ] = newMember;
        memberGroup.members.push( memberId );
        display.emit( 'display:member:added', newMember );

        return newMember;
      },

      read: function( memberId ) {
        return store.members[ memberId ];
      },

      update: function( member, stateData ) {
        var prop, oldState = member.state;

        for(prop in stateData) {
          if( stateData.hasOwnProperty( prop ) ) {
            member.state[ prop ] = stateData[ prop ];
          }
        }

        // Trigger Hook
        radar.on.memberChangeState( member, oldState );

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
