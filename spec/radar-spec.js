describe("Radar", function() {
  var subject = new Radar();

  it("is a Radar object", function() {
    expect(typeof subject).toBe('object');
    expect(subject.constructor.name).toBe('Radar');
  });

  it("has a storeController property", function() {
    expect(subject.storeController).toBeDefined();
  });

  it("has models", function() {
    expect(subject.models).toBeDefined();
  });

  it("has a store property", function() {
    expect(typeof subject.store).toBe('string');
    expect(subject.store).toMatch('store-');
  });

  // it("has a geometries property", function() {
  //   expect(subject.geometries).toBeDefined();
  // });

  it("has a display property", function() {
    expect(subject.display).toBeDefined();
  });

  it("has an on property", function() {
    expect(subject.on).toBeDefined();
  });

  describe("#on", function() {
    it("has a memberChangeState hook", function() {
      expect( subject.on.memberChangeState ).toBeDefined();
    });
  });

  xdescribe("#screen", function() {
    it("is an object", function() {
      expect(typeof subject.screen).toBe('object');
    });

    it("has an element property that contains a canvas element", function() {
      expect(subject.screen.element.nodeName).toBe('CANVAS');
    });

    it("has a width property that is a number", function() {
      expect(typeof subject.screen.width).toBe('number');
    });

    it("has a height property that is a number", function() {
      expect(typeof subject.screen.height).toBe('number');
    });
  });

  xdescribe("#start", function() {
    it("is defined", function() {
      expect(subject.start).toBeDefined();
    });

    it("starts the Physics animator", function() {
      spyOn(Physics.util.ticker, 'start');
      subject.start();
      expect(Physics.util.ticker.start).toHaveBeenCalled();
    });
  });
});
