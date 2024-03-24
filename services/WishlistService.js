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

    this.getSetting = function () {
        let setting = JSON.parse(localStorage.getItem('setting'));
        if (setting) return setting
        return {
            general: {
                keycap_per_line: 4,
                priority_color: '#000000',
                priority_font: 'roboto',
                background_color: '#FFFFFF'
            },
            legend: {
                font: 'roboto',
                color: '#FF0000'
            },
            title: {
                font: 'roboto',
                color: '#FF0000'
            }
        }
    }

    this.saveSetting = function (setting) {
        localStorage.setItem('setting', JSON.stringify(setting));
    }
});