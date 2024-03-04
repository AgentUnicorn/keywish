var wishlist = angular.module("WishlistController", []);
wishlist.controller("WishlistController", function($scope, $uibModal, WishlistService)
{
    $scope.data = WishlistService.getAllWishlist();    
    $scope.keycap = {}
    $scope.sections = {
        1: false,
        2: false,
        3: false
    }
    
    $scope.showContent = function(section_id) 
    {
        $scope.sections[section_id] = !$scope.sections[section_id];
    };

    $scope.createKeycap = function(section_id, keycap) 
    {
        $scope.data = WishlistService.createKeycap(section_id, keycap)
    }

    $scope.removeKeycap = function(section_id, keycap_id)
    {
        $scope.data = WishlistService.deleteKeycap(section_id, keycap_id)
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
                wishlist: () => $scope.data
            }
        });

        modalInstance.result.then(function(result) {
            // Handle modal close (optional)
        }, function() {
            // Handle modal dismiss (optional)
        });
    }

    $scope.openEditModal = function (section_id, keycap) 
    {  
        console.log($scope.data)
        const modalInstance = $uibModal.open({
            templateUrl: 'partials/Modal.html', // Path to your modal content template
            controller: 'ModalController', // Controller for the modal instance
            size: 'xlg', // Optional size (e.g., 'sm', 'lg')
            windowClass: 'show',
            resolve: {
                section_id: () => section_id,
                keycap: () => keycap,
                action: () => 'edit',
                wishlist: () => $scope.data
            }
        });

        modalInstance.result.then(function(result) {
            // Handle modal close (optional)
            console.log(result)
        }, function() {
            // Handle modal dismiss (optional)
        });
    }

});