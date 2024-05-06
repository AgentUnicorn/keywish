app.controller(
  "ModalController",
  function (
    $scope,
    $uibModalInstance,
    WishlistService,
    section_id,
    keycap,
    action,
    wishlist
  ) {
    $scope.myImage = "";
    $scope.myCroppedImage = "";
    $scope.section_id = section_id;
    $scope.action = action;
    $scope.keycap = keycap ?? {};
    $scope.wishlist = wishlist ?? {};

    // Live review
    // $scope.blockingObject = { block: true };
    // $scope.callTestFuntion = function () {
    //   $scope.blockingObject.render(function (dataURL) {
    //     console.log("via render");
    //     console.log(dataURL.length);
    //   });
    // };
    // $scope.blockingObject.callback = function (dataURL) {
    //   console.log("via function");
    //   console.log(dataURL.length);
    // };

    let handleFileSelect = function (evt) {
      var file = evt.currentTarget.files[0];
      console.log(file);
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.myImage = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document).ready(function () {
      angular
        .element(document.querySelector("#fileInput"))
        .on("change", handleFileSelect);
    });

    $scope.create = function () {
      $scope.keycap.fileURL = $scope.myCroppedImage;
      $scope.wishlist = WishlistService.createKeycap(
        $scope.wishlist,
        $scope.section_id,
        $scope.keycap
      );
      $uibModalInstance.close($scope.wishlist);
    };

    $scope.save = function () {
      $scope.keycap.img_url = $scope.myCroppedImage;
      WishlistService.editKeycap($scope.wishlist, $scope.section_id, $scope.keycap);
      $uibModalInstance.close($scope.wishlist);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
  }
);
