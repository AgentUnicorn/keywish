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

    // Version info
    $scope.version = "1.0";
    $scope.releaseDate = "March 14, 2024"; 
    
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

    $scope.openExportModal = function()
    {
        const modalInstance = $uibModal.open({
            templateUrl: 'partials/ExportModal.html', // Path to your modal content template
            controller: 'ExportModalController', // Controller for the modal instance
            size: 'lg', // Optional size (e.g., 'sm', 'lg')
            windowClass: 'show',
            resolve: {
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
        section.editing = true;
    };
    
    $scope.toggleEditing = function(section) {
        section.editing = !section.editing;
    };
    
    $scope.saveTitle = function(section) {
        section.title = angular.copy(section.editedTitle);
        delete section.editedTitle
        let section_index = $scope.sections.findIndex(s => s.id == section.id)
        if (section_index != -1) {
            $scope.sections[section_index] = section
            localStorage.setItem('sections', JSON.stringify($scope.sections));
        }
        section.editing = false;
    };
    
    $scope.cancelEditing = function(section) {
        section.editing = false;
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
});