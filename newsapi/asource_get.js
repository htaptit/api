'use strict';
const NewsAPI = require('newsapi');
const sleep = require('system-sleep');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const url = require('url');

const app = require(path.resolve(__dirname, '../server/server'));
const datasource = app.datasources.wordwide;

function run() {
  var gg = JSON.parse(fs.readFileSync('./ww_private.json', 'utf8'));

  for (var key in gg) {
    const newsapi = new NewsAPI(key);

    console.log("START UPDATING: " + gg[key]);

    newsapi.v2.everything({
      // q: 'bitcoin',
      sources: gg[key],
      // domains: '',
      // from: '',
      // to: '',
      pageSize: 1,
      // language: 'en',
      // sortBy: 'relevancy',
      page: 1
    }).then(response => {
      var objs = [];

      response.articles.forEach(function(item) {
        let _url = url.parse(item.url, true)

        var object = {
          "sid": item.source.id,
          "sname": item.source.name,
          "home_url": _url.host
        };

        datasource.models.asources.create(object, function(err, obj) {
            sleep(2);
          });

      });
    });

    
  }
}

run();



