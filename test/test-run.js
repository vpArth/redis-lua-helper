var Tool = require('..')
  , Test = require('simple-test-runner').Test
  , client = require('redis').createClient()
  ;
var tests = new Test('Run Test');

tests.add('without params', function(success, fail){
  var tool = new Tool(client);
  tool.flush();
  tool.load('return5', 'return 5');
  tool.waitRun('return5', function(err, res){
    if(res == 5) return success();
    return fail(new Error('Should return 5 instead of '+res));
  })
});

tests.add('2 keys', function(success, fail){
  var tool = new Tool(client);
  tool.flush();
  tool.load('twokeys', 'return {KEYS[1], KEYS[2]}');
  tool.waitRun('twokeys',{
    keys: ['key1', 'key2']
  }, function(err, res){
    if(res[1] == 'key2') return success();
    return fail(new Error('Should return key2 instead of '+res[1]));
  })
});

tests.add('sum args', function(success, fail){
  var tool = new Tool(client);
  tool.flush();
  tool.load('sum args', 'local sum = 0 for i=1,table.maxn(ARGV) do sum = sum + ARGV[i] end return sum');
  tool.waitRun('sum args',{
    argv: [1,2,3,4,5]
  }, function(err, res){
    if(res == 15) return success();
    return fail(new Error('Should return 15 instead of '+res));
  })
});

tests.run(function (res) {
  process.exit(res);
});

