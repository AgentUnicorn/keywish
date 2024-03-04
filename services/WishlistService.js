app.service('WishlistService', function(HelperService, $http) {
    // Service logic
    this.getAllWishlist = function () 
    {
        let wishlist = JSON.parse(localStorage.getItem('wishlist'));
        if (wishlist) return wishlist
        return {
            1: [],
            2: [],
            3: []
        }
    }

    this.createKeycap = function (wishlist, section_id, keycap) 
    {  
        let id = HelperService.guid()
        // console.log(keycap.fileURL)
        // HelperService.send_msg_telegram("heelo " + id)
        // let img_url = this.saveCroppedImage(id, keycap.fileURL)
        // console.log(img_url)

        let new_keycap = {
            id: id,
            name: keycap.name,
            img_url: keycap.fileURL
        }

        if (!wishlist) {
            wishlist = this.getAllWishlist()
        }
        wishlist[section_id]?.push(new_keycap)
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        return wishlist
    }

    this.deleteKeycap = function (section_id, keycap_id) 
    {  
        let wishlist = this.getAllWishlist()
        let section_data = wishlist[section_id].filter((k) => k.id != keycap_id)
        wishlist[section_id] = section_data
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        return wishlist
    }

    this.saveCroppedImage = function (keycap_id, fileURL) {
      if (fileURL) {
        // Create a new object to store in IndexedDB
        let blob = HelperService.dataURLtoBlob(fileURL)
        let fileName = keycap_id + "-" + Date.now() + ".png"
        console.log(blob.type)
        let tempFile = new File([blob], fileName);

        var formData = new FormData();
        formData.append('image', tempFile);
        return $http({
            url: "https://api.imgur.com/3/image",
            method: "POST",
            datatype: "json",
            headers: {
                "Authorization": "Client-ID 7c61c07bd376452",
                "Content-Type": "multipart/form-data;"
            },
            data: formData,
        }).then(function(response) {
            console.log(response)
        })
        console.log(formData.get('photo'))
        return

        var botToken = '6748941821:AAF1pzYYUzqn3mj2HCiD36nqmI1BwVy38Pc';
        var chatId = '-4148808693';

        return $http.post('https://api.telegram.org/bot' + botToken + '/sendPhoto?chat_id=' + chatId, formData, {
            headers: {
                'Content-Type': undefined
            }
        }).then(function(response) {
            if (response.data && response.data.result && response.data.result.photo) {
                // Telegram returns multiple sizes of the uploaded photo, we'll use the largest available size
                var photoArray = response.data.result.photo;
                var largestPhoto = photoArray[photoArray.length - 1];
                var photoUrl = 'https://telegram.org/img/' + largestPhoto.file_id;
                return photoUrl;
            } else {
                throw new Error('Failed to upload image to Telegram CDN.');
            }
        }).catch(function(error) {
            console.error('Error uploading image to Telegram CDN:', error);
            throw error; // Rethrow the error to be handled by the caller
        });
      } else {
        console.error("Image URL is not available.");
      }
    };
});