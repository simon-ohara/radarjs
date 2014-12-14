xdescribe("RadarSignalService", function() {
  var subject = new RadarSignalService();

  it("is a Radar object", function() {
    expect(typeof subject).toBe('object');
    expect(subject.constructor.name).toBe('RadarSignalService');
  });

  it("expects the passed param to be an object with a store and a receiver", function() {
    
  });
});
