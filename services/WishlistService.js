app.service('WishlistService', function(HelperService, $http) {
    // Service logic
    this.getAllSection = function () 
    {  
        let sections = JSON.parse(localStorage.getItem('sections'));
        if (sections) return sections
        return [
            {
                title: "Section 1",
                id: 1,
                type: "array",
                data: []
            },
            {
                title: "Section 2",
                id: 2,
                type: "array",
                data: []
            },
            {
                title: "Section 3",
                id: 3,
                type: "text",
                data: ""
            },
        ]
    }

    this.createKeycap = function (wishlist, section_id, keycap) 
    {  
        let id = HelperService.guid()
        let new_keycap = {
            id: id,
            name: keycap.name,
            img_url: keycap.fileURL
        }

        wishlist = this.pushKeycapIntoSectionData(wishlist, section_id, new_keycap)
        localStorage.setItem('sections', JSON.stringify(wishlist));
        return wishlist
    }

    this.editKeycap = function (wishlist, section_id, keycap)
    {
        wishlist = this.replaceKeycapInSectionData(wishlist, section_id, keycap)
        localStorage.setItem('sections', JSON.stringify(wishlist))
        return wishlist
    }

    this.deleteKeycap = function (section_id, keycap_id) 
    {  
        let wishlist = this.getAllSection()
        wishlist = this.removeKeycapFromSectionData(wishlist, section_id, keycap_id)
        localStorage.setItem('sections', JSON.stringify(wishlist));
        return wishlist
    }

    this.saveCroppedImage = function (keycap_id, fileURL) {
      if (fileURL) {
        // Create a new object to store in IndexedDB
        let blob = HelperService.dataURLtoBlob(fileURL)
        let fileName = keycap_id + "-" + Date.now() + ".png"
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

    this.pushKeycapIntoSectionData = function (sections, section_id, keycap) {
        var section = sections.find(s => s.id === section_id);
        if (section) {
            section.data.push(keycap);
        } else {
            console.error("Object with id " + section_id + " not found.");
        }
    
        return sections;
    }

    this.replaceKeycapInSectionData = function (sections, section_id, keycap) {
        var section = sections.find(s => s.id === section_id);
        if (section) {
            var index = sections.findIndex(obj => obj.id === keycap.id);
            if (index !== -1) {
                section[index] = newObj;
            }
        } else {
            console.error("Object with id " + section_id + " not found.");
        }
        
        return sections;
    }

    this.removeKeycapFromSectionData = function (sections, section_id, keycap_id) {
        var section = sections.find(s => s.id === section_id);
        if (section) {
            section.data = section.data.filter(kc => kc.id !== keycap_id);
        } else {
            console.error("Object with id " + section_id + " not found.");
        }
    
        return sections;
    }
});