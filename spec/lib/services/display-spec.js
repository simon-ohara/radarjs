xdescribe("Display Service", function() {
  var subject = new Radar(),
      display = subject.display
      params = {
        foo: 'foo:channel',
        bar: { data: 'baz' }
      };

  describe("#notify", function() {
    beforeEach(function() {
      spyOn(display, 'emit');
    });

    it("triggers the 'emit' method on the display", function() {
      subject.services.display.notify();
      expect(display.emit).toHaveBeenCalled();
    });

    it("passes on the params unaltered", function() {
      subject.services.display.notify( params.foo, params.bar );
      expect(display.emit).toHaveBeenCalledWith( params.foo, params.bar );
    });

    it("allows the data param to be optional", function() {
      subject.services.display.notify( params.foo );
      expect(display.emit).toHaveBeenCalledWith( params.foo );
    });

    it("throws an error if the channel param is not a string", function() {
      expect( function() {
        subject.services.display.notify( params.bar );
      }).toThrow();
    });
  });
});
