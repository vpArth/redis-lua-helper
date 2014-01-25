[![Build Status](https://travis-ci.org/vpArth/redis-lua-helper.png?branch=master)](https://travis-ci.org/vpArth/redis-lua-helper)
[![NPM version](https://badge.fury.io/js/arth-redis-lua.png)](http://badge.fury.io/js/arth-redis-lua)

redis-lua-helper
================

# Lua scripts helper for RedisClient
## Install
  `npm install redis-lua-loader`

##Usage:

```javascript
  var Lua = require('redis-lua-loader');
  //create helper and link to RedisClient
  client.lua = new Lua(client);
  //flush all lua scripts
  client.lua.flush();
  //load new script
  client.lua.load('some script', 'return {KEYS[1], ARGV[1]+ARGV[2]+ARGV[3]}');
  //run lua script(waitRun will wait when script will be loaded)
  client.lua.waitRun('some script',{
    keys: ['key1'],
    argv: [1,2,3]
  }, function(err, res){
    console.log(res);// ['key1', 6]
  })
```
