(function(root, R) {
  root.Radar = R.call( root );  
})(this, function() {
  'use strict';
  // world / display
  // behaviors
  // bodies
  // store
  // receiver
  // services
  
  // this.store = new RadarStore(); 
  // this.geometries = new RadarGeometries();
  // this.receiver = new WebSocket( options.url );

  var window = this, 
      document = window.document,
      physics = window.Physics,
      _internal = {
        modules: {},
        services: {},
        display: {}
      };


  function Radar() {
    var element = document.createElement('canvas');
    element.id = 'RadarScreen';

    this.screen = {
      element: element,
      name: element.id,
      width: window.innerWidth,
      height: window.innerHeight
    };


    _internal.radar = this;

    initializeServices.call(this);
    initializeModules.call(this);

    console.log( this.services.display );
  }

  // Radar.prototype.physicsEngine = Physics;
  Radar.prototype.start = function() {
    physics.util.ticker.start();
  };

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
;(function() {

  // Register a new body based on a circle
  physics.body('base', 'circle', function( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this, options );
      }
    };
  });

  var // private declarations

  groupRGB = '189, 195, 199',

  groupProperties = {
    x: 0,
    y: 0,
    restitution: 0.99,
    radius: 30,
    mass: 4,
    styles: {
      fillStyle: 'rgba(' + groupRGB + ', 0.15)',
      strokeStyle: 'rgba(' + groupRGB + ', 0.1)',
      lineWidth: 15
    }
  },

  memberProperties = {
    x: 0,
    y: 0,
    radius: 5,
    mass: 100,
    styles: {
      fillStyle: 'rgba(46, 204, 113, 1)'
    }
  };

  // A class that generates a PhysicsJS Body
  function BaseBody( options ) {
    var prop, baseBody = physics.body( 'base', options );

    // Merge the PhysicsJS body object into this class
    for( prop in baseBody ) {
      if( baseBody.hasOwnProperty( prop ) ) {
        this[ prop ] = baseBody[ prop ];
      } 
    }
    this.__proto__ = baseBody.__proto__;
  }

  function GroupBody( groupId ) {
    this.entity = 'group';
    this.uid = groupId;
    this.__proto__ = new BaseBody( groupProperties );
  }

  function MemberBody( memberId ) {
    this.entity = 'member';
    this.uid = memberId;
    this.__proto__ = new BaseBody( memberProperties ); 
  }


  function RadarGeometries() {}

  RadarGeometries.prototype = {
    groupBody: GroupBody,
    memberBody: MemberBody
  };

  _internal.geometries = new RadarGeometries();

}());
;(function( _internal ) {

  function DisplayService() {
    var Display = this.display;

    console.log( Display );

    return {
      notify: function( channel, data ) {
        if( channel && typeof channel !== 'string' ) {
          throw new TypeError("Invalid channel assignment. " + channel + " is not a string");
        }

        Display.emit.apply( Display, arguments );
      }
    };
  }


  _internal.services.display = DisplayService;  
}( _internal ));
;(function( _internal ) {
  _internal.display.renderer = function( screen ) {
    var thisConfig = {
      el: screen.name,
      width: screen.width,
      height: screen.height,
      meta: false
    };

    return physics.renderer( 'canvas', thisConfig );
  };
}( _internal ));
;(function( _internal ) {
  var behaviors = _internal.display.behaviors = {},
      registered = [];

  behaviors.addTo = function ( display ) {
    registered.map( function( behavior, index, behaviorsArray ) {
      var thisBehavior = new behaviorsArray[ index ]( display );
    });
  };

  behaviors.register = function( behavior ) {
    registered.push( behavior ); 
  };

  // The Behaviors object
  // Contains a list of all behaviors available to the RadarDisplay
  // Calling init will return an array of initialised Physics behavior objects
  // _internal.display.behaviors = {
  //   init: init,
  //   list: behaviors
  // };

}( _internal ));
;(function( _internal ) {
  var memberBehaviors = [
    physics.behavior('body-impulse-response'),
    physics.behavior('sweep-prune'),
    physics.behavior('body-collision-detection')
  ];

  function addMember( memberData ) {
    // create a new member entity
    var member = new _internal.geometries.memberBody( memberData.uid );

    // save a reference to the store
    memberData.body = member;

    // update the radar
    this.display.add( member );
    this.display.emit( 'display:member:added', memberData.uid );
  }

  function updateMember( memberData ) {
    var member = this.display.findOne({ uid: memberData.uid, entity: 'member' });

    if( member ) {
      this.display.emit( 'display:member:updated', memberData.uid );
    }
  }

  function updateMemberBehaviors() {
    var allMembers = this.allMembers();

    memberBehaviors.map( function( item, index, arr ) {
      item.applyTo( allMembers );
    }, this);
  }

  function allMembers() {
    return this.display.find({ entity: 'member' });
  }

  function behaviorMethods( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this );
        this.options( options );
      },
      connect: function( world ) {
        this.display = world;
        world.on('store:member:added', addMember, this);
        world.on('store:member:updated', updateMember, this);
        // world.on('display:member:updated', this.updateMemberBehaviors, this);
        // memberBehaviors.map( function( item, index, arr ) {
          // world.add( item.applyTo( [] ) );
        // }, this);
      },
      disconnect: function( world ) {
        world.off('store:member:added', addMember, this);
        world.off('store:member:updated', updateMember, this);
      }
    };
  }

  function MemberBehavior( display ) {
    // Register new behavior with the physics engine
    physics.behavior( 'member', behaviorMethods );

    display.addBehavior( physics.behavior( 'member' ) );
  }

  _internal.display.behaviors.register( MemberBehavior );
  
}( _internal ));
;(function( _internal ) {

  var attractors  = {
        global: physics.behavior('attractor', {
          order: 1,
          strength: 0.001
        })
      },
      edges = {},
      convoyBehaviors = [
        attractors.global,
        physics.behavior('body-impulse-response'),
        physics.behavior('sweep-prune'),
        physics.behavior('body-collision-detection'),
        // physics.behavior('body-collision-detection', { channel: 'display:lockring:collided' }),
        // physics.behavior('interactive-custom', { el: radar.canvas })
      ];

  function addGroup( groupData ) {
    // create a new group entity
    var group = new _internal.geometries.groupBody( groupData.uid );

    // save a reference to the store
    groupData.body = group;

    // update the radar
    this.display.add( group );
    this.display.emit('display:group:added', groupData.uid);
  }

  function behaviorMethods( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this );
        this.options( options );
      },
      connect: function( world ) {
        this.display = world;
        world.on('store:group:added', addGroup, this);
        // world.on('store:group:added', this.testing, this);
        // world.on('store:group:added', function() {
        //   console.log("in here"); 
        // });
        // world.on('display:group:added', this.applyGroupBehavior, this);
        // world.on('display:container:added', this.updateGroup, this);
        // world.on('display:container:removed', this.checkContainers, this);

        // world.on('radar:lock:established', this.removeInteraction, this);
        // world.on('radar:lock:released', this.applyInteraction, this);
        // world.on('integrate:positions', this.behave, this);
        // world.on('collisions:candidates', physics.util.throttle( this.lockCheck, 500), this);

        // this.updateGlobalAttractor();

        // groupBehaviors.map( function( item, index, arr ) {
        //   world.add( item.applyTo( [] ) );
        // });
          // physics.behavior('group-interaction'),

        // this.applyInteraction( world );
      },
      disconnect: function( world ) {
        // world.off('manifest:container:updated', this.updateContainer, this);
        // world.off('radar:container:added', this.containerAdded, this);
        // world.off('integrate:positions', this.behave, this);
      } //,
      // updateGlobalAttractor: function() {
      //   attractors.global.position( radar.center );
      //   attractors.global.applyTo( this.allGroups() );
      // },
      // applyGroupBehavior: function( groupBody ) {
      //   this.updateGroupBehaviors();
      //   this.applyGroupAttractor( groupBody );
      //   this.applyGroupBounds( groupBody );
      //   this.updateGlobalAttractor();
      // },
      // allGroups: function() {
      //   var groups;
      //   
      //   try {
      //     groups = radar.display.find({ entity: 'group' });
      //   } catch( e ) {
      //     groups = [];
      //   } finally {
      //     return groups;
      //   }
      // },
      // updateGroupBehaviors: function() {
      //   groupBehaviors.map( function( item, index, arr ) {
      //     item.applyTo( this.allGroups() );
      //   }, this);
      //   // groupBehaviors['lockring-collisions'].applyTo( entities.groups.concat(lockRing) );
      // },
      // applyGroupAttractor: function( groupBody ) {
      //   var attractor = physics.behavior('attractor', {
      //     order: 1,
      //     strength: 0.001,
      //     groupTarget: groupBody.name
      //   });

      //   attractor.position( groupBody.state.pos );
      //   attractor.applyTo( this.groupContainers( groupBody.name ) );

      //   // store reference
      //   attractors[groupBody.name] = attractor;
      //   // add to the world
      //   display.add( attractor );
      // },
      // applyGroupBounds: function( groupBody ) {
      //   var groupBounds = physics.aabb(groupBody.radius * 2, groupBody.radius * 2, groupBody.state.pos),
      //       groupEdgeCollision = physics.behavior('edge-collision-detection', {
      //         aabb: groupBounds,
      //         restitution: 0.99,
      //         cof: 0.99
      //       });

      //   edges[groupBody.name] = {
      //     bounds: groupBounds,
      //     collision: groupEdgeCollision
      //   };

      //   display.add( groupEdgeCollision.applyTo( this.groupContainers( groupBody.name ) ) );
      // },
      // removeGroupAttractor: function( groupBody ) {
      //   var attractor = attractors[groupBody.name];

      //   if(attractor === undefined) {
      //     return false;
      //   } else {
      //     view.remove( attractor );
      //     delete attractor;
      //     return true;
      //   }
      // },
      // groupContainers: function( groupName ){
      //   return radar.display.find({ entity: 'container', group: groupName });
      // },
      // updateGroup: function( containerData ) {
      //   var groupName = containerData.group,
      //       containers = this.groupContainers( groupName );

      //   attractors[groupName].applyTo( containers );
      //   edges[groupName].collision.applyTo( containers );
      // },
      // behave: function( data ) {
      //   var c, currentGroup, attractor,
      //       groupsList = this.allGroups(),
      //       numGroups = groupsList.length,
      //       groupEdge, groupAttractor;

      //   for (c=0; c<numGroups; c++) {
      //     currentGroup = groupsList[c];
      //     groupAttractor = attractors[currentGroup.name];
      //     groupEdge = edges[currentGroup.name];

      //     groupAttractor.position( currentGroup.state.pos );

      //     groupEdge.bounds.x = currentGroup.state.pos.x;
      //     groupEdge.bounds.y = currentGroup.state.pos.y;
      //     groupEdge.collision.setAABB( groupEdge.bounds );
      //   }
      // }
    };
  }

  function GroupBehavior( display ) {
    // Register new behavior with the physics engine
    physics.behavior( 'group', behaviorMethods );

    display.addBehavior(  physics.behavior( 'group' ) );
  }

  _internal.display.behaviors.register( GroupBehavior );

}( _internal ));
;(function( _internal ) {

  var screen, display, internals = _internal.display;

  function init() {
    var renderer = internals.renderer( screen );
        // behaviors = internals.behaviors.init();

    display = physics( function(world) {
      // subscribe to events
      world.on('step', function() { world.render(); });
      // world.on({
        // 'step': function() { world.render(); },
        // 'service:convoy:added': addConvoy,
        // 'service:convoy:removed': removeConvoy,
        // 'service:container:added': addContainer,
        // 'service:container:removed': removeContainer,
        // 'service:container:updated': updateContainer
      // });

      world.add( renderer );
      // world.add( behaviors );
      // apply settings to world
      // world.add([
        // Physics.behavior('container-behavior'),
        // Physics.behavior('convoy-behavior'),
        // Physics.behavior('convoy-interact'),
        // Physics.behavior('lockring-behavior'),
        // viewPortEdge,
      // ]);

      // subscribe to ticker to advance the simulation
      physics.util.ticker.on( function( time, dt ){
        world.step( time );
      });

      // start the ticker
      // physics.util.ticker.start();
    });
  }


  function RadarDisplay(radar) {
    screen = radar.screen;

    init.call(this);
    _internal.display.behaviors.addTo( display );

    return display;
  };

  _internal.modules.display = RadarDisplay;
}( _internal ));


  function initializeModules() {
    for( var module in _internal.modules ) {

      if( module === 'store' ) {
        this[ module ] = _internal.modules[ module ].call(this);
      } else {
        this[ module ] = new _internal.modules[ module ](this);
      }

      if( module === 'display' ) {
        _internal.display.instance = this[ module ];
      }
    }
  }

  function initializeServices() {
    this.services = {};

    for( var service in _internal.services ) {
      this.services[ service ] = _internal.services[ service ].call(this);  
    }
  }

  return Radar;

});
