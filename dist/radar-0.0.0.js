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
    store: {},

    // Modules to be used in this package
    modules: {}
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
    var element = document.createElement('canvas');
    element.id = 'RadarScreen';

    this.models = _root.models;

    // this.screen = {
    //   element: element,
    //   name: element.id,
    //   width: window.innerWidth,
    //   height: window.innerHeight
    // };


    // _internal.radar = this;

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
;(function() {

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
;(function() {

  var store = _root.store;

  // A controller to manage data in the private root store object
  //
  // methods: add, get, set, remove
  //
  function StoreController() {
    var radar = this,
        grp = radar.groupModelService,
        mbr = radar.memberModelService;

    store.groups = [];

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