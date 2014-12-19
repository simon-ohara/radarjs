(function() {

  var attractors  = {
        global: physics.behavior('attractor', {
          order: 1,
          strength: 0.001
        })
      },
      edges = {},
      groupBehaviors = [
        attractors.global,
        physics.behavior('body-impulse-response'),
        physics.behavior('sweep-prune'),
        physics.behavior('body-collision-detection'),
        // physics.behavior('body-collision-detection', { channel: 'display:lockring:collided' }),
        // physics.behavior('interactive-custom', { el: radar.canvas })
      ];


  function behaviorMethods() {
    var display = this;

    function applyGroupBehavior( group ) {
      updateGroupBehaviors();
      applyGroupAttractor( group.body );
      applyGroupBounds( group.body );
      updateGlobalAttractor();
    }

    function updateGroupBehaviors() {
      groupBehaviors.map( function( item, index, arr ) {
        item.applyTo( display.findAll('groups') );
      }, this);
      // groupBehaviors['lockring-collisions'].applyTo( entities.groups.concat(lockRing) );
    }

    function applyGroupAttractor( groupBody ) {
      var attractor = physics.behavior('attractor', {
        order: 1,
        strength: 0.001,
        groupTarget: groupBody.id
      });

      attractor.position( groupBody.state.pos );
      attractor.applyTo( display.findMembersOfGroup( groupBody.id ) );

      // store reference
      attractors[ groupBody.id ] = attractor;
      // add to the world
      display.addBehavior( attractor );
    }

    function applyGroupBounds( groupBody ) {
      var groupBounds = physics.aabb(groupBody.radius * 2, groupBody.radius * 2, groupBody.state.pos),
          groupEdgeCollision = physics.behavior('edge-collision-detection', {
            aabb: groupBounds,
            restitution: 0.99,
            cof: 0.99
          });

      edges[ groupBody.id ] = {
        bounds: groupBounds,
        collision: groupEdgeCollision
      };

      display.addBehavior( groupEdgeCollision.applyTo( display.findMembersOfGroup( groupBody.id ) ) );
    }

    function updateGlobalAttractor() {
      attractors.global.position( display.screen.center );
      attractors.global.applyTo( display.findAll('group') );
    }

    // Returnable
    return function( parent ) {
      return {
        init: function( options ) {
          parent.init.call( this );
          this.options( options );
        },
        connect: function( world ) {
          // world.on('store:group:added', addGroup, this);
          // world.on('store:group:added', this.testing, this);
          // world.on('store:group:added', function() {
          //   console.log("in here"); 
          // });
          world.on('display:group:added', applyGroupBehavior, this);
          // world.on('display:container:added', this.updateGroup, this);
          // world.on('display:container:removed', this.checkContainers, this);

          // world.on('radar:lock:established', this.removeInteraction, this);
          // world.on('radar:lock:released', this.applyInteraction, this);
          world.on('integrate:positions', this.behave, this);
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
            groupEdge = edges[currentGroup.id];

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

    _root.display.behaviors.push( physics.behavior( 'group' ) );
  }

  _root.display.modules.groupBehavior = GroupBehavior;

})();
