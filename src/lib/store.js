(function( _internal ) {

  // The Store
  //
  // The internal object that stores the state of groups and members
  // with references to their display bodies.
  //
  // Store structure
  //  ```
  //  {
  //    groups: [
  //      {
  //        uid: 'group-uid-string' (name),
  //        body: [body Object ref],
  //        members: [
  //          {
  //            uid: 'member-uid-string',
  //            group: 'group-uid-string'
  //            body: [body Object ref],
  //            state: {
  //              ...
  //            }
  //          },
  //          ...
  //        ]
  //      }
  //    ]
  //  }
  //  ```
  //
  function RadarStore() {

    var store = {
      groups: []
    },


    DisplayService = this.services.display,


    // Group methods
    //
    group = {

      // Add a new group to the store
      //
      // params: groupId (string)
      //
      // returns: group (object) the newly added group object
      //
      add: function( groupId ) {
        var groups = store.groups,
            newGroupIdx = groups.length,
            newGroup = {
              uid: groupId,
              members: []
            };

        groups.push( newGroup );

        DisplayService.notify( 'store:group:added', newGroup );

        return groups[ newGroupIdx ];
      },

      // Retrieve a group object if it exists
      //
      // params: groupId (string)
      //
      // returns: group (object) or undefined
      //
      get: function( groupId ) {
        var retrievedGroup, idx,
            groups = store.groups,
            numGroups = groups.length;

        // Loop through each group object to check if the uid matches the 
        // passed groupId param
        //
        // if it does stop the loop and return
        // if it doesnt complete the loop and return
        for( idx=0; idx<numGroups; idx++ ) {
          if( groups[idx].uid === groupId ) {
            retrievedGroup = groups[idx];
            break;
          }
        }

        return retrievedGroup;
      },

      // Find or create a group object with a given uid
      //
      // params: groupId (string)
      //
      // returns: group (object)
      //
      set: function( groupId ) {
        return group.get.call( this, groupId ) || group.add.call( this, groupId );
      },

      // Remove group
      remove: {}
    },


    // Member methods
    //
    member = {

      // Add a new member to the store
      //
      // params: groupId (string), memberId (string)
      //
      // returns: member (object) the newly added member object
      //
      add: function( groupId, memberId ) {
            // Find or create group for this member
        var thisGroup = group.set.call( this, groupId ),
            groupMembers = thisGroup.members,
            newMemberIdx = groupMembers.length,
            newMember = {
              uid: memberId,
              group: groupId,
              state: {} 
            };

        groupMembers.push( newMember );

        DisplayService.notify( 'store:member:added', newMember );

        return groupMembers[ newMemberIdx ];
      },

      // Retrieve a member object if it or its group exist
      //
      // params: groupId (string), memberId (string)
      //
      // returns: member (object)
      //
      get: function( groupId, memberId ) {
        var thisGroup = group.get( groupId ),
            groupMembers, numGroupMembers,
            idx, retrievedMember;

        // Stop if the group cannot be found
        if( thisGroup === undefined ) return thisGroup;
          
        groupMembers = thisGroup.members;
        numGroupMembers = groupMembers.length;

        // Loop through each member object to check if the uid matches the 
        // passed memberId param
        //
        // if it does stop the loop and return
        // if it doesnt complete the loop and return
        for( idx=0; idx<numGroupMembers; idx++ ) {
          if( groupMembers[ idx ].uid === memberId ) {
            retrievedMember = groupMembers[idx]; 
            break;
          }
        }

        return retrievedMember;
      },

      // Find or create a member object and set its state
      //
      // params: data (object)
      //
      // returns: member (object)
      //
      set: function( data ) {
        var groupId = data.group,
            memberId = data.member,
            targetMember = member.get.call( this, groupId, memberId ) || member.add.call( this, groupId, memberId );

        targetMember.state = data.state;

        DisplayService.notify( 'store:member:updated', targetMember );

        return targetMember;
      },

      // Remove member
      remove: {}
    },


    // A custom error for data validation failure
    //
    DataStructureError = function( message ) {
      this.message = message;
      this.name = "DataStructureError";
    },


    // A method to validate the data passed for updating the store
    // 
    // Expected structure:
    //
    //  ```
    //  {
    //    member: 'member-uid-string',
    //    group: 'group-uid-string',
    //    state: {
    //      ...
    //    }
    //  }
    //
    validate = function( data ) {
      var prop,
          numRequirementsFulfilled = 0,
          requiredProperties = [ "member", "group", "state" ],
          numRequiredProperties = requiredProperties.length,
          missingProperties = [];

      // The data param must be an object
      if(typeof data !== 'object') {
        throw new TypeError("Invalid argument type: '" + data + "' is not an object.");
      }

      // Does data contain all of the required properties?
      if( data.member && data.group && data.state ) {
        return true;
      } else {
        requiredProperties.map( function( propertyName, index, propertiesArray ) {
          if( data[ propertyName ] === undefined ) {
            missingProperties.push( propertyName );
          }
        });

        throw new DataStructureError("Invalid Data Structure: The argument passed doe not contain the properties " + missingProperties.join(" or "));
      }
    };

    return {
      // Update a member of the store with passed data
      //
      // params: data (object)
      //
      update: function( data ) {
        if( validate( data ) ) {
          return member.set.call( this, data );
        }
      },

      get: function( groupId, memberId ) {
        if( groupId ) {
          if( typeof groupId !== 'string' ) {
            throw new TypeError("Invalid groupId: '" + groupId + "' is not a string.");
          }

          if( memberId ) {
            if( typeof memberId !== 'string' ) {
              throw new TypeError("Invalid memberId: '" + memberId + "' is not a string.");
            }

            return member.get( groupId, memberId );
          } 

          return group.get( groupId );
        } else {
          throw new TypeError("Requires atleast one argument for groupId as a string.");
        }
      }
    };

  }

  _internal.modules.store = RadarStore;

}( _internal ));
