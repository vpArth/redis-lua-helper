
var RedisClient = require('redis').RedisClient
  , events = require('events')
  , util = require('util')
  , fs = require('fs')
  ;


function Lua(client){
  if(!(client instanceof RedisClient))
    throw new Error('client should be a instance of RedisClient');

  var scripts = {}
    , self = this
    ;

  /**
   *
   * @param key
   * @param filename
   * @param [next]
   */
  function load(key, filename, next){
    function checkFile(next){
      fs.exists(filename, function(exists){
        if(!exists) return next(null, filename); // use filename as a raw script
        return fs.readFile(filename, function(err, script){
          if(err && next) return next(err);
          return next(null, script);
        });
      })
    }

    checkFile(function(err, script){
      return client.script('load', script, function(err, hash){
        if(err && next) return next(err);
        scripts[key] = hash;
        self.emit(key + ' script loaded',  hash);
        self.emit('script loaded', key,  hash);
        return next && next(null, hash);
      });
    })
  }

  /**
   *
   * @param key - key used when script loaded
   * @param params - {keys:[], argv:[]}
   * @param next
   * @returns {*}
   */
  function run(key, params, next){
    if(!next && typeof params == 'function'){
      next = params;
      params = {};
    }

    var hash = scripts[key];
    if(!hash) return next(new Error('Unknown script'));
    var args = [hash];
    var keys_num = params.keys&&params.keys.length || 0;
    var argv_num = params.argv&&params.argv.length || 0;
    args.push( keys_num );
    if(keys_num) params.keys.forEach(function(key){ args.push(key); });
    if(argv_num) params.argv.forEach(function(arg){ args.push(arg); });
    if(next) args.push(next);

    return client.evalsha.apply(client, args);
  }

  function waitRun(key, params, next){
    var hash = scripts[key];
    if(hash) return self.run(key, params, next);
    return self.on(key+' script loaded', function(){
      self.run(key, params, next);
    })
  }

  function flush(next){
    client.script('flush', function(){
      self.emit('scripts flushed');
      next&&next.apply(self, arguments);
    });
  }

  self.load = load;
  self.run  = run;
  self.waitRun  = waitRun;
  self.flush = flush;
}
util.inherits(Lua, events.EventEmitter);

module.exports = Lua;