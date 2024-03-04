app.service('HelperService', function ($http) {
        this.guid = function() {
            function s4() {
              return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
          }

        this.dataURLtoBlob = function (dataURL) {
          var parts = dataURL.split(';base64,');
          var contentType = parts[0].split(':')[1];
          var raw = window.atob(parts[1]);
          var rawLength = raw.length;
          var uInt8Array = new Uint8Array(rawLength);
      
          for (var i = 0; i < rawLength; ++i) {
              uInt8Array[i] = raw.charCodeAt(i);
          }
      
          return new Blob([uInt8Array], { type: contentType });
        }

        this.send_msg_telegram = function(message)
        {
          console.log("Sending...")
          var botToken = '6748941821:AAF1pzYYUzqn3mj2HCiD36nqmI1BwVy38Pc';
          var chatId = '-4148808693';
          return $http.post('https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + "&text=" + message, {
            headers: {
                'Content-Type': undefined
            }
          }).then(function(response) {
            if (response.data && response.data.result && response.data.result.photo) {
                console.log("SUCCESS")
            } else {
                throw new Error('Failed to upload image to Telegram CDN.');
            }
        }).catch(function(error) {
            console.error('Error uploading image to Telegram CDN:', error);
            throw error; // Rethrow the error to be handled by the caller
        });
        }
    });