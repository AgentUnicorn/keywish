app.controller(
  "SettingModalController",
  function ($scope, $uibModalInstance, WishlistService) {
    $scope.setting = WishlistService.getSetting();
    $scope.fonts = [
        {name: "Roboto", slug: "roboto"}
    ];
    $scope.colors = [
        {name: "White", hex: "#FFFFFF"},
        {name: "Black", hex: "#000000"},
        {name: "Red", hex: "#FF0000"},
    ];

    $scope.save = function () {
      WishlistService.saveSetting($scope.setting);
      $uibModalInstance.close("OK");
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
  }
);
