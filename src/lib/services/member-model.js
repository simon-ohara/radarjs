(function() {

  var store = _root.store,
      Member = _root.models.member;

  function MemberModelService() {
    return {

      create: function( memberId, group ) {
        var newMember = new Member( memberId, group.id );
        group.members.push( newMember );

        return newMember;
      },

      read: function( memberId, group ) {
        var idx, radar = this,
            members = group.members,
            totalMembers = members.length,
            member = undefined;

        if( memberId && members.length ) {
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
            member[ prop ] = stateData[ prop ];
          }
        }

        return member;
      },

      destroy: function() {}
    };
  }

  _root.modules.memberModelService = MemberModelService;

})();
