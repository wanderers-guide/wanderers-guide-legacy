const { PrismaClient } = require('@prisma/client');
const { find } = require('lodash');
const NodeCache = require("node-cache");

const memCache = new NodeCache();

const prisma = new PrismaClient({
  log: [
    //{ emit: 'stdout', level: 'query', },
    { emit: 'stdout', level: 'error', },
    //{ emit: 'stdout', level: 'info', },
    { emit: 'stdout', level: 'warn', },
  ],
});

/*
prisma.$on('query', e => {
  console.log("~ Duration: " + e.duration + "ms");
});*/

/*
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});
*/

prisma.$use(async (params, next) => {

  let strParams = JSON.stringify(params);

  let cached_result = memCache.get(strParams);
  if(cached_result == null){

    const result = await next(params);
    if(!strParams.includes('"NOT":{"id":-1}}')){// Don't cache query is it contains NOT: id:-1
      let success = memCache.set(strParams, result); // TODO: Give a TTL
      console.log('Caching Result... '+success);
    } else {
      console.log('Not Caching Result');
    }

    return result;

  } else {
    return cached_result;
  }

});

module.exports.Prisma = prisma;
module.exports.MemCache = memCache;