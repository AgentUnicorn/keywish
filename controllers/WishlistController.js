var wishlist = angular.module("WishlistController", []);
wishlist.controller("WishlistController", function($scope, $uibModal, WishlistService, $timeout)
{
    $scope.sections = WishlistService.getAllSection();
    $scope.data = {};    
    $scope.keycap = {}
    $scope.section_view = {
        1: false,
        2: false,
        3: false
    }

    let debounceTimeout;
    
    $scope.showContent = function(section_id) 
    {
        $scope.sections[section_id] = !$scope.sections[section_id];
    };

    $scope.removeKeycap = function(section_id, keycap_id)
    {
        $scope.sections = WishlistService.deleteKeycap(section_id, keycap_id)
    }

    $scope.openNewModal = function (section_id) 
    {  
        const modalInstance = $uibModal.open({
            templateUrl: 'partials/Modal.html', // Path to your modal content template
            controller: 'ModalController', // Controller for the modal instance
            size: 'lg', // Optional size (e.g., 'sm', 'lg')
            windowClass: 'show',
            resolve: {
                section_id: () => section_id,
                keycap: () => null,
                action: () => 'create',
                wishlist: () => $scope.sections
            }
        });

        modalInstance.result.then(function(result) {
            // Handle modal close (optional)
        }, function() {
            // Handle modal dismiss (optional)
        });
    }

    $scope.editTitle = function(section) {
        section.editedTitle = angular.copy(section.title);
        $scope.editing = true;
    };
    
    $scope.toggleEditing = function() {
        $scope.editing = !$scope.editing;
    };
    
    $scope.saveTitle = function(section) {
        section.title = angular.copy(section.editedTitle);
        delete section.editedTitle
        let section_index = $scope.sections.findIndex(s => s.id == section.id)
        if (section_index != -1) {
            $scope.sections[section_index] = section
            localStorage.setItem('sections', JSON.stringify($scope.sections));
        }
        $scope.editing = false;
    };
    
    $scope.cancelEditing = function() {
        $scope.editing = false;
    };

    $scope.lazyInputChange = function(section) {
        if (debounceTimeout) {
            $timeout.cancel(debounceTimeout);
        }
        
        debounceTimeout = $timeout(function() {
            // Your code here to handle the input change after a delay
            $scope.sections[2] = section
            localStorage.setItem('sections', JSON.stringify($scope.sections));
        }, 500); // Adjust the delay (in milliseconds) as needed
    };

    $scope.preview = function (param) 
    {  

    }

    $scope.exportToPNG = function() {
        let template = document.getElementById('export-template').innerHTML;
        // console.log(template)
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        // Render HTML content to canvas
        html2canvas(document.getElementById('export-container'), {
            onrendered: function(canvas) {
                var imgData = canvas.toDataURL('image/png');
                var link = document.createElement('a');
                link.download = 'exported-data.png';
                link.href = imgData;
                link.click();
            }
        });
    };

    $scope.element = angular.element(document.getElementById('export-template'));
    $scope.getCanvas = null;

    $scope.previewImage = function() {
        console.log(document.getElementById('export-template'))
        html2canvas($scope.element, {
            onrendered: function(canvas) {
                angular.element(document.getElementById('previewImage')).append(canvas);
                $scope.getCanvas = canvas;
            }
        });
    };

    $scope.convertHtmlToImage = function() {
        if ($scope.getCanvas) {
            var imgageData = $scope.getCanvas.toDataURL("image/png");
            var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");

            var downloadLink = angular.element(document.getElementById('btn-Convert-Html2Image'));
            downloadLink.attr("download", "GeeksForGeeks.png").attr("href", newData);
        }
    };
});