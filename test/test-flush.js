var Tool = require('..')
  , Test = require('simple-test-runner').Test
  , client = require('redis').createClient()
  ;
var tests = new Test('Flush Test');

tests.add('run after flush', function(success, fail){
  var tool = new Tool(client);
  tool.load('return5', 'return 5');
  tool.flush();
  tool.run('return5', function(err, res){
    if(err) return success();
    return fail(new Error('Should error triggered'));
  })
});


tests.run(function (res) {
  process.exit(res);
});

