(function() {

  var Member = _root.models.member,
      MemberBody = _root.display.bodies.member;

  function MemberController() {
    var display = this.display;

    function addBody( memberId ) {
      var body = new MemberBody( memberId );

      display.addBody( body );

      return body; 
    }

    return {

      create: function( memberId, group ) {
        var newMember = new Member( memberId, group.id );
        newMember.body = addBody( memberId );

        group.members.push( newMember );

        return newMember;
      },

      read: function( memberId, group ) {
        var idx, member,
            members = group.members,
            totalMembers = members.length;

        if( memberId && totalMembers ) {
          for( idx=0; idx<totalMembers; idx++ ) {
            if( members[ idx ].id === memberId ) {
              member = members[ idx ];
              break;
            }
          }
        }

        return member;
      },

      update: function( member, stateData ) {
        for(var prop in stateData) {
          if( stateData.hasOwnProperty( prop ) ) {
            member.state[ prop ] = stateData[ prop ];
          }
        }

        return member;
      },

      destroy: function() {}
    };
  }

  _root.modules.memberController = MemberController;

})();
