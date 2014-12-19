describe("DisplayScreen", function() {
  var radar, subject;

  beforeEach( function() {
    radar = new Radar();
    subject = radar.display.screen;
  }); 

  it("is an object", function() {
    expect(typeof subject).toBe('object');
  });

  it("has an element property that contains a canvas element", function() {
    expect(subject.element.nodeName).toBe('CANVAS');
  });

  it("has a width property that is a number", function() {
    expect(typeof subject.width).toBe('number');
  });

  it("has a height property that is a number", function() {
    expect(typeof subject.height).toBe('number');
  });

  it("has a center property", function() {
    expect( subject.center ).toBeDefined();
  });
});
