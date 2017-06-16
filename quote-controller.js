var http = require('http');
var fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();
var Twitter = require('twitter');

module.exports.sharequoteimage = function (req, res) {

var args = {
    headers: {
      "X-Mashape-Key": "O63081NlUmmshBqD4OK3bhucLm5cp1G47D5jsnHTJeUxCPBAtb",
      "Accept": "application/json"
    }
  }
  var url_to_get_quotes = "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous&count=1"
  client.get(url_to_get_quotes, args,
    function (data, response) {
      var quote = data["quote"];
      var author = data["author"]
      var text = "\n\n     \"" + data["quote"] + "\" \n\n       ~ " + author + "\n\n";
      args["parameters"] = {
        "bcolor": "000000",
        "fcolor": "FFFFFF",
        "font": "trebuchet",
        "size": "15",
        "text": text,
        "type": "jpg"
      }
      var convert_into_image = "https://img4me.p.mashape.com/"
      client.get(convert_into_image, args, function (data, response) {
        var imageUrl = data.toString('utf8');
        var request = http.get(imageUrl, function (response) {
          var imagedata = ''
          response.setEncoding('binary');

          response.on('data', function (chunk) {
            imagedata += chunk;
          });

          response.on('end', function () {

            fs.writeFileSync('image.jpg', imagedata, 'binary');

            var data = fs.readFileSync('image.jpg');

            var client_to_post_twitter = new Twitter({
              consumer_key: 'laJQtmvafFFKtvdk0TsgzodCC',
              consumer_secret: 'bPOdlxj0aKLLTci8uzlSm3VFapaKWJwHuKP3Oax7T1Fqxj96Dj',
              access_token_key: '874885731315044353-Zf6Mpzna0kxCvsPMclJKHkOU1rX6Mat',
              access_token_secret: 'uAnZuHExiDZANRQ5vK3DUQsfQPixqriYf29JDt9HJNNmD'
            });
            client_to_post_twitter.post('media/upload', { media: data })
              .then(function (media) {
                console.log(media);

                var status = {
                  status: quote + " ~ " + author,
                  media_ids: media.media_id_string
                }

                client_to_post_twitter.post('statuses/update', status)
                  .then(function (tweet) {
                    console.log(tweet);
                    res.json(tweet);
                  })
                  .catch(function (error) {
                    throw error;
                    res.json(error);
                  });
              })
              .catch(function (error) {
                console.log(error)
                res.json(JSON.stringify(error));
                throw error;
              });
          });
        });
      });
    });
}
