'use strict';
const crypto = require('crypto');
const NewsAPI = require('newsapi');
const sleep = require('system-sleep');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = require(path.resolve(__dirname, '../server/server'));
const datasource = app.datasources.ww_db;


const gg = JSON.parse(fs.readFileSync('./ww_private.json', 'utf8'));

var types = [];

function getSources(_sources) {
  if(types.length > 0) {
    // Kiem tra
    _sources(types);
  } else {
    datasource.models.sources.find({"include": ["types", "newsapiAccessToken"]}, function(err, obj) {
      types = obj;
      // callback
      _sources(types);
    })
  }
}

// params
// types objs
// name string
function getSourceIdBySid(sources, sid) {
  for(var i = 0; i < sources.length; i++) {
    var _source = sources[i].toJSON();
    if (_source.sid === sid) {
      return _source.id
    }
  }

  return null;
}

function getArticles() {
  getSources(function(sources) {
    for (var key in sources) {
      const _source = sources[key].toJSON();

      // init news api
      const newsapi = new NewsAPI(_source.newsapiAccessToken.key);

      newsapi.v2.everything({
      sources: _source.sid,
      pageSize: 100,
      language: 'en',
      page: 1
      }).then(response => {
        var objs = [];

        response.articles.forEach(function(item) {
          var object = {
            "author": item.author,
            "title": item.title,
            "description": item.description,
            "url": item.url,
            "urlToImage": item.urlToImage,
            "publishedAt": item.publishedAt,
            "content": item.content,
            "typesId": _source.types.id,
            "sourcesId": _source.id
          };

          datasource.models.earticles.findOrCreate({"where": {"url": object.url, "sourcesId": _source.id, "author": item.author}}, object, function(err, obj) {
            if(err && err.code !== 'ER_DUP_ENTRY') {
              console.log("=>>>>>>>>>>>>>>>>> Error <<<<<<<<<<<<<<<=: %s", err.code);
            }
          });
        });
      });
    }
  })
}

getArticles();

// cron.schedule('*/10 * * * *', function(){
//   console.log(Date.now());
//   run();
// });