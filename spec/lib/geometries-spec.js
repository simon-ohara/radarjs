xdescribe("RadarGeometries", function() {
  var subject = new RadarGeometries();

  it("is an object", function() {
    expect(typeof subject).toBe('object');
  });

  it("defines a base body in PhysicsJS", function() {
    expect(Physics.body('base')).toBeDefined();
  });


  // ParentBody
  //
  describe("#ParentBody", function() {
    beforeEach(function() {
      this.base = Physics.body('base');
    });

    it("is defined", function() {
      expect(subject.ParentBody).toBeDefined();
    });

    it("is an instance of BaseBody", function() {
      var parentBody = new subject.ParentBody();
      expect( parentBody.constructor.name ).toEqual("BaseBody");
    });

    it("has the properties expected of a parent body", function() {
      var item,
          parentBody = new subject.ParentBody(),
          parentRGB = '189, 195, 199',
          parentProps = {
            restitution: 0.99,
            radius: 30,
            mass: 4,
            styles: {
              fillStyle: 'rgba(' + parentRGB + ', 0.15)',
              strokeStyle: 'rgba(' + parentRGB + ', 0.1)',
              lineWidth: 15
            }
          };

      for( prop in parentProps ) {
        expect( parentBody[ prop ] ).toEqual( parentProps[ prop ] ); 
      }
    });
  });


  // ChildBody
  //
  describe("#ChildBody", function() {
    it("is defined", function() {
      expect( subject.ChildBody ).toBeDefined();
    });

    it("has the properties expected of a child body", function() {
      var item,
          childBody = new subject.ChildBody(),
          childProps = {
            radius: 5,
            mass: 100,
            styles: {
              fillStyle: 'rgba(46, 204, 113, 1)'
            }
          };

      for( prop in childProps ) {
        expect( childBody[ prop ] ).toEqual( childProps[ prop ] ); 
      }
    });
  });
});
