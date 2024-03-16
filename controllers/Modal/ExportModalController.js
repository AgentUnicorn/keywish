app.controller(
  "ExportModalController",
  function ($scope, $uibModalInstance, wishlist, $timeout) {
    $scope.wishlist = wishlist ?? {};
    $scope.element = angular.element(
      document.getElementById("export-template")
    );
    $scope.getCanvas = null;

    // $scope.preview = function (param) {};

    $scope.exportToPNG = function () {
      let template = document.getElementById("export-template").innerHTML;
      // console.log(template)
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      // Render HTML content to canvas
      html2canvas(document.getElementById("export-container"), {
        onrendered: function (canvas) {
          var imgData = canvas.toDataURL("image/jpg");
          var link = document.createElement("a");
          link.download = "exported-data.png";
          link.href = imgData;
          link.click();
        },
      });
    };

    $scope.previewImage = function () {
      html2canvas($scope.element, {
        onrendered: function (canvas) {
          angular
            .element(document.getElementById("previewImage"))
            .append(canvas);
          $scope.getCanvas = canvas;
        },
      });
    };

    // $scope.convertHtmlToImage = function () {
    //   if ($scope.getCanvas) {
    //     var imgageData = $scope.getCanvas.toDataURL("image/png");
    //     var newData = imgageData.replace(
    //       /^data:image\/png/,
    //       "data:application/octet-stream"
    //     );

    //     var downloadLink = angular.element(
    //       document.getElementById("btn-Convert-Html2Image")
    //     );
    //     downloadLink
    //       .attr("download", "GeeksForGeeks.png")
    //       .attr("href", newData);
    //   }
    // };
    // $timeout($scope.draw, 100); // Call drawImages after a short delay to ensure DOM is ready

    $scope.draw = function () {
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      let row = 0;
      let col = 0;
      let spacing = 10; // Spacing between images
      let imageSize = 150; // Size of each image
      let maxCols = Math.ceil(canvas.width / (imageSize + spacing)); // Maximum number of columns

      wishlist.forEach((section) => {
        console.log(row)
        if (section.data) {
          for (let i = 0; i < section.data.length; i++) {
            let image = new Image();
            image.src = section.data[i].img_url;
            image.onload = function () {
              ctx.drawImage(
                image,
                col * (imageSize + spacing),
                row * (imageSize + spacing),
                imageSize,
                imageSize
              );

              col++;
              if (col >= maxCols) {
                col = 0;
                row++;
              }
            };
          }
        }
      });
    };


    $scope.save = function () {
      $uibModalInstance.close("OK");
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
  }
);
