var Tool = require('..')
  , Test = require('simple-test-runner').Test
  , client = require('redis').createClient()
  ;
var tests = new Test('Load Test');

tests.add('wrong client', Test.catch(function () {
  new Tool({});
}, new Error('client should be a instance of RedisClient')));

tests.add('right client', function(success, fail){
  var tool = new Tool(client);
  tool.flush();
  tool.load('return5', 'return 5');
  tool.waitRun('return5', function(err, res){
    if(res == 5) return success();
    return fail(new Error('Should return 5 instead of '+res));
  })
});

tests.run(function (res) {
  process.exit(res);
});

