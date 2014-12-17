(function( _global ) {
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

  var // Internal package variable declarations
  
  // The root of this package
  _root = {

    // Models to be used
    models: {},

    // The data store
    stores: {},

    // Modules to be used in this package
    modules: {},

    // Code concerned with display only
    display: {
      behaviors: [],
      bodies: {},
      // Modules to be used only for the display
      modules: {}
    }
  },

  // The DOM this package has access to
  _dom = _global.document,

  // The PhysicsJS reference
  physics = _global.Physics;

// _internal = {
//   modules: {},
//   services: {},
//   display: {}
// };


  function Radar() {
    this.models = _root.models;

    // initializeServices.call(this);
    initializeModules.call(this);
  }

  // Radar.prototype.physicsEngine = Physics;
  Radar.prototype.start = function() {
    physics.util.ticker.start();
  };

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
;(function() {
  // The model representing member objects
  //
  // It can be instantiated in the following ways
  //
  // var member;
  //
  // member = new MemberModel();
  // member.id === undefined;
  // member.group === undefined;
  // member.state === {};
  //
  // member = new MemberModel("memberId");
  // member.id === "memberId";
  // member.group === undefined;
  // member.state === {};
  //
  // member = new MemberModel("memberId", "groupId");
  // member.id === "memberId";
  // member.group === "groupId";
  // member.state === {};
  //
  // member = new MemberModel("memberId", "groupId", { foo: "Foo Value" });
  // member.id === "memberId";
  // member.group === "groupId";
  // member.state === { foo: "Foo Value" };
  //
  // member = new MemberModel({ id: "memberId", group: "groupId", state: { foo: "Foo Value " } });
  // member.id === "memberId";
  // member.group === "groupId;
  // member.state === { foo: "Foo Value" };
  //
  function MemberModel() {
    var data = arguments[0],
        groupId = arguments[1],
        stateData = arguments[2];

    // Defaults
    this.id = undefined;
    this.group = undefined;
    this.state = {};

    // Assess the first argument
    if( data ) {
      if( typeof data === 'string' ) {
        this.id = data;
      } else {
        // It might be an object
        // Look for corresponding keys and assign appropriately
        if( data.id ) { this.id = data.id; }
        if( data.group ) { this.group = data.group; }
        if( data.state ) { this.state = data.state; }
      }
    }

    // If there is a second argument it should be the groupId
    if( groupId && typeof groupId === 'string' ) {
      this.group = groupId;
    }

    // If there is a third argument it should be a state object
    if( stateData && typeof stateData === 'object' && stateData instanceof Object ) {
      this.state = stateData;
    }

  }

  _root.models.member = MemberModel;
})();
;(function() {

  // The Store Instance
  //
  // The private data object that stores the state of groups and members
  // with references to their display bodies.
  //
  // Radar instances are given a store uid to access it
  //
  function RadarStore() {
    var uid = "store-"+Date.now();

    _root.stores[ uid ] = {};

    return uid;
  }

  _root.modules.store = RadarStore;

})();
;(function() {

  var element = _dom.createElement('canvas');
  element.id = 'RadarScreen';

  function DisplayScreen() {
    return {
      element: element,
      name: element.id,
      width: _global.innerWidth,
      height: _global.innerHeight
    };
  }

  _root.display.modules.screen = DisplayScreen;
})();
;(function() {
  function DisplayRenderer() {
    var screen = this.screen;

    var thisConfig = {
      el: screen.name,
      width: screen.width,
      height: screen.height,
      meta: false
    };

    return physics.renderer( 'canvas', thisConfig );
  };

  _root.display.modules.renderer = DisplayRenderer;
})();
;(function() {

  // Register a new body based on a circle
  physics.body('base', 'circle', function( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this, options );
      }
    };
  });

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

  _root.display.bodies.base = BaseBody;

})();
;(function() {
  var BaseBody = _root.display.bodies.base,

  groupRGB = '189, 195, 199',
  options = {
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
  };

  function GroupBody( groupId ) {
    this.entity = 'group';
    this.id = groupId;
    this.__proto__ = new BaseBody( options );
  }

  _root.display.bodies.group = GroupBody;

})();
;(function() {
  var BaseBody = _root.display.bodies.base,

  options = {
    x: 0,
    y: 0,
    radius: 5,
    mass: 100,
    styles: {
      fillStyle: 'rgba(46, 204, 113, 1)'
    }
  };

  function MemberBody( memberId ) {
    this.entity = 'member';
    this.id = memberId;
    this.__proto__ = new BaseBody( options ); 
  }

  _root.display.bodies.member = MemberBody;

})();
;(function() {

  var bodies = _root.display.bodies;

  function DisplayBodies() {
    return {
      group: bodies.group,
      member: bodies.member
    };
  }

  _root.display.modules.bodies = DisplayBodies;

})();
;(function() {

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

  // function addGroup( groupData ) {
  //   // create a new group entity
  //   var group = new _internal.geometries.groupBody( groupData.uid );

  //   // save a reference to the store
  //   groupData.body = group;

  //   // update the radar
  //   this.display.add( group );
  //   this.display.emit('display:group:added', groupData.uid);
  // }

  function behaviorMethods( parent ) {
    return {
      init: function( options ) {
        parent.init.call( this );
        this.options( options );
      },
      connect: function( world ) {
        this.display = world;
        // world.on('store:group:added', addGroup, this);
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

  function GroupBehavior() {
    // Register new behavior with the physics engine
    physics.behavior( 'group', behaviorMethods );

    _root.display.behaviors.push( physics.behavior( 'group' ) );
  }

  _root.display.modules.groupBehavior = GroupBehavior;

})();
;(function() {

  // var screen, display, internals = _internal.display;

  function Display( modules ) {
    // var renderer = internals.renderer( screen );
        // behaviors = internals.behaviors.init();

    this.__proto__ = physics( function(world) {
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

      world.add( modules.renderer );
      world.add( modules.behaviors );
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

  function applyDisplayModules() {
    var module, modules = _root.display.modules;

    for( module in modules ) {
      this[ module ] = modules[ module ].call(this);
    }
  }

  function RadarDisplay() {
    // _internal.display.behaviors.addTo( display );
    this.behaviors = _root.display.behaviors;

    applyDisplayModules.call( this );

    return new Display( this );
  };

  _root.modules.display = RadarDisplay;

})();
;(function() {

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
;(function() {

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
;(function() {

  // A controller to manage data in the private root store object
  //
  // methods: add, get, set, remove
  //
  function StoreController() {
    var radar = this,
        store = _root.stores[ radar.store ],
        grp = radar.groupController,
        mbr = radar.memberController;

    store.groups = store.groups || [];

    function add() {
      var id = arguments[0],
          group = arguments[1];

      if( group && typeof group === 'object' && group instanceof Object ) {
        return mbr.create.apply( radar, arguments );
      }

      return grp.create.apply( radar, arguments );
    }

    function get() {
      var id = arguments[0],
          group = arguments[1];

      if( group ) {
        if( typeof group === 'string' ) {
          // Retieve the group object
          group = get( group );
          // Run through this function again with a group object
          return get( id, group );
        }
        
        else if( typeof group === 'object' && group instanceof Object ) {
          return mbr.read.apply( radar, arguments );
        }
      }

      return grp.read.apply( radar, arguments );
    } 

    return {
      update: function( data ) {
        var group, member;

        if( check( data ).isValid ) {
          group = get( data.group ) || add( data.group );
          member = get( data.member, group ) || add( data.member, group );

          return mbr.update.apply( radar, [ member, data.state ] );
        }
      },

      get: get
    };  
  }


  // Check the validity of the data being passed through
  //
  // data should be of the structure
  //  {
  //    member: "member ID as a string",
  //    group: "group ID as a string",
  //    state: {} // an object containing arbitrary data
  //  }
  //
  // returns an object with an isValid property set to a boolean value
  //
  function check( data ) {
    var requiredProperties = [ "member", "group", "state" ],
        missingProperties = [],
        result = { isValid: false };

    // The data param must be an object
    if(typeof data !== 'object') {
      throw new TypeError("Invalid argument type: '" + data + "' is not an object.");
    }

    // Does data contain all of the required properties?
    if( data.member && data.group && data.state ) {
      result.isValid = true;
      return result;
    } else {
      requiredProperties.map( function( propertyName, index, propertiesArray ) {
        if( data[ propertyName ] === undefined ) {
          missingProperties.push( propertyName );
        }
      });

      throw new DataStructureError("Invalid Data Structure: The argument passed doe not contain the properties " + missingProperties.join(" or "));
    }

    return result;
  }

  // Export the StoreController to the package-root modules object
  _root.modules.storeController = StoreController;
})();


  function initializeModules() {
    var module, modules = _root.modules; 
    for( module in modules ) {
      this[ module ] = modules[ module ].call(this);
    }
  }

  function initializeServices() {
    this.services = {};

    for( var service in _internal.services ) {
      this.services[ service ] = _internal.services[ service ].call(this);  
    }
  }

  // Export the Radar package
  _global.Radar = Radar;

})( this );
