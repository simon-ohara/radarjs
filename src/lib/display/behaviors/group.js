(function() {

  var attractors  = {
        global: physics.behavior('attractor', {
          id: 'group:attractor',
          order: 1,
          strength: 0.001
        })
      },
      containers = {},
      groupBehaviors = [
        attractors.global,
        physics.behavior('body-impulse-response', { id: 'group:impulse' }),
        physics.behavior('sweep-prune', { id: 'group:sweep' }),
        physics.behavior('body-collision-detection', { id: 'group:collision' }),
        // physics.behavior('body-collision-detection', { channel: 'display:lockring:collided' }),
        // physics.behavior('interactive-custom', { el: radar.canvas })
      ];


  function behaviorMethods() {
    var display = this;

    function applyGroupBehavior( group ) {
      updateGroupBehaviors();
      addGroupMemberAttractor( group.body );
      addGroupMemberContainment( group.body );
    }

    function updateGroupBehaviors() {
      groupBehaviors.map( function( item, index, arr ) {
        item.applyTo( display.findAll('group') );
      }, this);
      // groupBehaviors['lockring-collisions'].applyTo( entities.groups.concat(lockRing) );
    }

    function addGroupMemberAttractor( groupBody ) {
      var attractor = physics.behavior('attractor', {
        order: 1,
        strength: 0.001,
        groupTarget: groupBody.id,
        id: 'member:attractor:' + groupBody.id
      });

      // Set the position of the attractor to match the group
      attractor.position( groupBody.state.pos );
      // Ensure that the behavior is not applied to any existing bodies
      attractor.applyTo( [] );
      // store reference
      attractors[ groupBody.id ] = attractor;
      // add to the world
      display.addBehavior( attractor );
    }

    function addGroupMemberContainment( groupBody ) {
      var groupBounds, groupEdgeCollision;

      groupBounds = physics.aabb(groupBody.radius * 2, groupBody.radius * 2, groupBody.state.pos),

      groupEdgeCollision = physics.behavior('edge-collision-detection', {
        aabb: groupBounds,
        restitution: 0.99,
        cof: 0.99,
        id: 'member:containment:' + groupBody.id
      });

      // Ensure that the behavior is not applies to any existing bodies
      groupEdgeCollision.applyTo( [] );
      // store a reference
      containers[ groupBody.id ] = {
        bounds: groupBounds,
        collision: groupEdgeCollision
      };
      // add to the world
      display.addBehavior( groupEdgeCollision );
    }

    // This could be used to adjust the position on the
    // window/screen resize event
    // function updateGlobalAttractor() {
    //   attractors.global.position( display.screen.center );
    // }

    // Returnable
    return function( parent ) {
      return {
        init: function( options ) {
          parent.init.call( this );
          this.options( options );
        },
        connect: function( world ) {
          // Add group behaviors
          groupBehaviors.map( function( item, index, arr ) {
            world.addBehavior( item.applyTo( [] ) );
          });

          // Subscribe to Events
          world.on('display:group:added', applyGroupBehavior, this);
          world.on('integrate:positions', this.behave, this);



          // world.on('store:group:added', addGroup, this);
          // world.on('store:group:added', this.testing, this);
          // world.on('display:container:added', this.updateGroup, this);
          // world.on('display:container:removed', this.checkContainers, this);

          // world.on('radar:lock:established', this.removeInteraction, this);
          // world.on('radar:lock:released', this.applyInteraction, this);
          // world.on('collisions:candidates', physics.util.throttle( this.lockCheck, 500), this);

          // physics.behavior('group-interaction'),

          // this.applyInteraction( world );
        },
        disconnect: function( world ) {
          // Remove group behaviors
          groupBehaviors.map( function( item, index, arr ) {
            world.removeBehavior( item.applyTo( [] ) );
          });
          // Unsubscribe from Events
          world.on('display:group:added', applyGroupBehavior, this);
          world.on('integrate:positions', this.behave, this);
          // world.off('manifest:container:updated', this.updateContainer, this);
          // world.off('radar:container:added', this.containerAdded, this);
          // world.off('integrate:positions', this.behave, this);
        },
        // removeGroupAttractor: function( groupBody ) {
        //   var attractor = attractors[groupBody.id];

        //   if(attractor === undefined) {
        //     return false;
        //   } else {
        //     view.remove( attractor );
        //     delete attractor;
        //     return true;
        //   }
        // },
        // updateGroup: function( containerData ) {
        //   var groupName = containerData.group,
        //       containers = this.groupContainers( groupName );

        //   attractors[groupName].applyTo( containers );
        //   edges[groupName].collision.applyTo( containers );
        // },
        behave: function( data ) {
          var c, currentGroup, attractor,
              groupsList = display.findAll('group'),
              numGroups = groupsList.length,
              groupEdge, groupAttractor;

          for (c=0; c<numGroups; c++) {
            currentGroup = groupsList[c];
            groupAttractor = attractors[currentGroup.id];
            groupEdge = containers[currentGroup.id];

            groupAttractor.position( currentGroup.state.pos );

            groupEdge.bounds.x = currentGroup.state.pos.x;
            groupEdge.bounds.y = currentGroup.state.pos.y;
            groupEdge.collision.setAABB( groupEdge.bounds );
          }
        }
      };
    };
  }

  function GroupBehavior() {
    // Register new behavior with the physics engine
    physics.behavior( 'group', behaviorMethods.call( this ) );

    this._radar.behaviors.push( physics.behavior( 'group', { id: 'display:group' }));
  }

  _root.display.modules.groupBehavior = GroupBehavior;

})();
