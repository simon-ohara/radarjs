var DATA = {};

(function() {
  var i, d, data = {
    foo: 2,
    bar: 5,
    baz: 1,
    qux: 7,
    oof: 2,
    rab: 3
  };

  for( d in data ) {
    DATA[ d ] = {
      group: d+'-group',
      members: []
    };

    for( i=0; i<data[ d ]; i++ ) {
      DATA[ d ].members.push({
        member: d+'-member-'+i,
        group: d+'-group',
        state: {}
      });
    }
  }
})();
