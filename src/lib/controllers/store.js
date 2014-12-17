(function() {

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
