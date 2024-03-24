app.controller(
  "ExportModalController",
  function ($scope, $uibModalInstance, WishlistService, wishlist) {
    $scope.wishlist = wishlist ?? {};
    $scope.element = angular.element(
      document.getElementById("export-template")
    );
    $scope.canvas = null;
    $scope.setting = WishlistService.getSetting()

    $scope.draw = function () {
      $scope.canvas = document.getElementById("myCanvas");
      var ctx = $scope.canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);

      // Set canvas background to white
      ctx.fillStyle = $scope.setting.general.background_color;
      ctx.fillRect(0, 0, $scope.canvas.width, $scope.canvas.height);

      // Define constants for layout
      var startX = 20; // X-coordinate of the starting position
      var startY = 20; // Y-coordinate of the starting position
      var imagePadding = 40;
      var imageSizeMultiply = 1.25;
      var imageWidth = 100 * imageSizeMultiply; // Width of each image
      var imageHeight = 100 * imageSizeMultiply; // Height of each image
      var spacingX = 20; // Horizontal spacing between images
      var spacingY = 20; // Vertical spacing between rows
      var textPadding = 10; // Padding between text and images
      var fontSize = 16; // Font size for title and name
      var sectionPadding = 20;

      function calculateImagesPerRow(arrayLength) {
        return arrayLength <= 16 ? 4 : 6;
      }

      $scope.wishlist.forEach(function (section, index) {

        // if (section.type == "array") {
          let imagesPerRow = $scope.setting.general.keycap_per_line;
          var totalImageWidth = imagesPerRow * imageWidth;
          let rowCount = 1
          if (index > 0) {
            rowCount = Math.round($scope.wishlist[index - 1].data.length / imagesPerRow)
          }
          // var rowStartX = ($scope.canvas.width - totalImageWidth) / 2;
          // console.log(totalImageWidth)

          ctx.font = "bold " + fontSize + "px Arial";
          var titleWidth = ctx.measureText(section.title).width;
          var titleX = ($scope.canvas.width - titleWidth) / 2;
          var titleY = startY + index * (imageHeight + fontSize + spacingY) * 2 + sectionPadding * index;
          ctx.fillStyle = "black";
          ctx.fillText(section.title, titleX, titleY);

          if (section.type == "array") {
            section.data.forEach(function (keycap, i) {
              var img = new Image();
              img.onload = function () {
                var row = Math.floor(i / imagesPerRow);
                var col = i % imagesPerRow;
                var imageX = (imagePadding + imageWidth) * col;
                var imageY =
                  titleY +
                  fontSize +
                  textPadding +
                  row * (imageHeight + spacingY);
  
                ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
                // ctx.drawImage(img, startX + (imageWidth + spacingX) * col, startY + (index + 1 + row) * (imageHeight + spacingY) + textPadding, imageWidth, imageHeight);
  
                ctx.font = fontSize + "px Arial";
                ctx.fillText(
                  keycap.name ?? '',
                  imageX,
                  imageY + imageHeight + fontSize
                );
              };
              img.src = keycap.img_url;
            });
          }

          if (section.type == "text") {
            ctx.font = fontSize + "px Arial";
                ctx.fillText(
                  section.data ?? '',
                  20,
                  canvas.width - 20
                );
          }
          
        // } else {
        //   ctx.font = "bold " + fontSize + "px Arial";
        //   var titleWidth = ctx.measureText(section.title).width;
        //   var titleX = ($scope.canvas.width - titleWidth) / 2;
        //   var titleY = startY + index * (imageHeight + fontSize + spacingY) * rowCount + sectionPadding * index;
        //   ctx.fillStyle = "black";
        //   ctx.fillText(section.title, titleX, titleY);
        // }
      });
    };

    $scope.download = function () {
      // Convert canvas to image
      var canvasDataUrl = $scope.canvas.toDataURL('image/png');
                    
      // Create a temporary anchor element to download the image
      var link = document.createElement('a');
      link.download = 'canvas_image.png';
      link.href = canvasDataUrl;
      
      // Trigger the download
      link.click();
    }

    $scope.save = function () {
      $uibModalInstance.close("OK");
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
  }
);
