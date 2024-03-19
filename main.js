

// function deleteItem(index) {
//     var itemList = JSON.parse(localStorage.getItem('wishlist')) || [];
//     itemList.splice(index, 1);
//     localStorage.setItem('wishlist', JSON.stringify(itemList));
//     renderWishlist();
// }

// function renderWishlist() {
//     var itemList = JSON.parse(localStorage.getItem('wishlist')) || [];
//     var wishlistElement = document.getElementById('wishlist');
//     wishlistElement.innerHTML = '';
//     itemList.forEach(function(item, index) {
//         var li = document.createElement('li');
//         li.textContent = item;
//         var deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Delete';
//         deleteButton.className = 'delete-btn';
//         deleteButton.onclick = function() {
//             deleteItem(index);
//         };
//         li.appendChild(deleteButton);
//         wishlistElement.appendChild(li);
//     });
// }

// document.addEventListener('DOMContentLoaded', function() {
//     renderWishlist();
// });

var app = angular.module("myApp",["WishlistController", "ngRoute", "ui.bootstrap", "ngAnimate", "uiCropper"]);

app.config(function($routeProvider) {
    $routeProvider
        
    .when('/', {
        templateUrl : 'pages/index.html',
        controller : 'WishlistController',
        resolve: {
            version: function(VersionService) {
                return VersionService.getVersion();
            }
        }
    })
        
    // .when('/blog', {
    // templateUrl : 'pages/second.html',
    // controller : 'SecondController'
    // })
        
    .otherwise({redirectTo: '/'});
    });
