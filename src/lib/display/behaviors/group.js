(function() {

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
