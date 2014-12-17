describe("RadarDisplay", function() {
  var radar = new Radar(),
      subject = radar.display;

  it("inherits the Physics.world instance", function() {
    // this can be confirmed by checking there is a circular reference in the integrator
    expect(subject._integrator._world).toEqual(subject.__proto__);
  });

  describe("its renderer", function() {
    it("exists", function() {
      expect(subject._renderer).not.toBe(null);
    });

    it("targets the radar screen property to render to", function() {
      expect(subject._renderer.el.id).toEqual(radar.screen.name);
    });

    it("sets its width to the radar screen width", function() {
      expect(subject._renderer.options.width).toEqual(radar.screen.width);
    });

    it("sets its height to the radar screen height", function() {
      expect(subject._renderer.options.height).toEqual(radar.screen.height);
    });
  });

  describe("its behaviors", function() {
    it("are present", function() {
      expect(subject._behaviors.length).toBeGreaterThan(0);
    });
  });
});
