'use strict';
const NewsAPI = require('newsapi');
const sleep = require('system-sleep');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = require(path.resolve(__dirname, '../server/server'));
const datasource = app.datasources.wordwide;

function run() {
  var gg = JSON.parse(fs.readFileSync('./ww_private.json', 'utf8'));

  var count = 0;

  for (var key in gg) {
    const newsapi = new NewsAPI(key);

    console.log("START UPDATING: " + gg[key]);

    newsapi.v2.everything({
      // q: 'bitcoin',
      sources: gg[key],
      // domains: '',
      // from: '',
      // to: '',
      pageSize: 100,
      language: 'en',
      // sortBy: 'relevancy',
      page: 1
    }).then(response => {
      var objs = [];

      response.articles.forEach(function(item) {
        var object = {
          "sid": item.source.id,
          "sname": item.source.name,
          "author": item.author,
          "title": item.title,
          "description": item.description,
          "url": item.url,
          "urlToImage": item.urlToImage,
          "publishedAt": item.publishedAt,
          "content": item.content
        };
        objs.push(object)
      });

      if(objs.length > 0) {
        datasource.models.ggarticles.create(objs, function(err, obj) {
          // console.log(objs[0].sid);

          // console.log("SUCCESS UPDATE: ");

          // console.log("Sleep 10 seconds");

          sleep(2);
        });  
      } else {
        // console.log("Done step: %s / %s", count, Object.keys(gg).length);
      }

      count = count + 1;
    });

    
  }
}

cron.schedule('*/10 * * * *', function(){
  console.log(Date.now());
  run();
});



