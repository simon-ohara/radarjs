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

    function add( id, groupId ) {
      if( groupId ) {
        return mbr.create.apply( radar, arguments );
      }

      return grp.create( id );
    }

    function get( id ) {
      return mbr.read( id ) || grp.read( id );
    }

    function update( data ) {
      var group, member;

      if( check( data ).isValid ) {
        // Check to see if grou exists
        if( get( data.group ) === undefined ) {
          // Create group if not
          add( data.group );
        }
        // Find or create the member object
        member = get( data.member ) || add( data.member, data.group );
        // Update the member object with the passed state
        return mbr.update( member, data.state );
      }
    }

    function remove( member ) {
      return mbr.destroy( member );
    }

    return {
      update: update,
      get: get,
      remove: remove
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
