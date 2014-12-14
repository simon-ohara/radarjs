xdescribe("RadarReceiver", function() {
  var subject = new RadarReceiver();

  it("is a RadarReceiver object", function() {
    expect(typeof subject).toBe('object');
    expect(subject.constructor.name).toBe('RadarReceiver');
  });

  xit("registers a new event", function() {
    expect();
  });
});
