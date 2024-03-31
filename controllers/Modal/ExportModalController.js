app.controller(
  "ExportModalController",
  function ($scope, $uibModalInstance, WishlistService, wishlist) {
    $scope.wishlist = wishlist ?? {};
    $scope.element = angular.element(
      document.getElementById("export-template")
    );
    $scope.canvas = null;
    const setting = WishlistService.getSetting();

    $scope.draw = function () {
      $scope.canvas = document.getElementById("myCanvas");
      var ctx = $scope.canvas.getContext("2d");

      // // Clear the canvas
      ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);

      var background = new Image();
      // background.src = "/assets/header.png";
      background.src = "../../assets/header.png";

      background.onload = function () {
        ctx.drawImage(background, 0, 0);

        // Define constants for layout
        var startX = 20; // X-coordinate of the starting position
        var startY = 20; // Y-coordinate of the starting position
        var imagePadding = 10;
        var imageSizeMultiply = 1.25;
        var imageWidth = 100 * imageSizeMultiply; // Width of each image
        var imageHeight = 100 * imageSizeMultiply; // Height of each image
        var spacingX = 20; // Horizontal spacing between images
        var spacingY = 20; // Vertical spacing between rows
        var textPadding = 10; // Padding between text and images
        var fontSize = 16; // Font size for title and name
        var sectionPadding = 80;
        var lineWidth = 2;
        
        // From setting
        var textColor = setting.general.priority_color
        // let imagesPerRow = keycap_per_line;
        // var textColor = "#FFFFFF"
        let imagesPerRow = 7;

        function calculateImagesPerRow(arrayLength) {
          return arrayLength <= 16 ? 4 : 6;
        }

        var rowCount = 0;
        $scope.wishlist.forEach(function (section, index) {

          var totalImageWidth = imagesPerRow * imageWidth;
          if (index > 0) {
            rowCount += Math.ceil(
              $scope.wishlist[index - 1].data.length / imagesPerRow
            );
          }

          ctx.font = "bold " + fontSize + "px Arial";
          var titleWidth = ctx.measureText(section.title).width;
          var titleX = ($scope.canvas.width - titleWidth) / 2 + textPadding;
          let titleY =
            startY +
            (imageHeight + fontSize + spacingY) * rowCount +
            sectionPadding * index;
          // console.log(titleY)
          ctx.fillStyle = textColor;
          ctx.fillText(section.title, titleX, titleY);

          let lineY = (fontSize - lineWidth) / 2;
          drawLine(
            ctx,
            spacingX,
            titleY - lineY,
            titleX - spacingX,
            titleY - lineY
          );

          drawLine(
            ctx,
            ctx.measureText(section.title).width + titleX + spacingX,
            titleY - lineY,
            $scope.canvas.width - spacingX,
            titleY - lineY
          );

          if (section.type == "array") {
            // let maxLine = 1;
            section.data.forEach(function (keycap, i) {
              var img = new Image();
              img.onload = function () {
                var row = Math.floor(i / imagesPerRow);
                var col = i % imagesPerRow;
                var imageX = (imagePadding + imageWidth) * col + imagePadding;
                var imageY =
                  titleY +
                  row * spacingY +
                  fontSize +
                  // (fontSize * maxLine - 1) * row +
                  textPadding +
                  row * (imageHeight + spacingY);
                // console.log(imageY)

                ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

                ctx.font = fontSize + "px Arial";
                var textWidth = ctx.measureText(keycap.name).width;
                // if (keycap.name) {
                //   let line = wrapText(ctx, keycap.name, imageWidth, imageX, imageY + imageHeight + spacingY);
                //   if (line > maxLine) {
                //     maxLine = line
                //   }
                // }
                // console.log("Section " + index + ": " + maxLine)
                ctx.fillText(
                  keycap.name ?? "",
                  imageX + (imageWidth - textWidth) / 2,
                  imageY + imageHeight + spacingY
                );
              };
              img.src = keycap.img_url;
            });
          }

          if (section.type == "text") {
            ctx.font = fontSize + "px Arial";
            let line = wrapText(
              ctx,
              section.data,
              $scope.canvas.width - 2 * spacingX,
              imagePadding,
              titleY + fontSize + textPadding
            );
          }
        });
      };

      // // Set canvas background to white
      // ctx.fillStyle = $scope.setting.general.background_color;
      // ctx.fillRect(0, 0, $scope.canvas.width, $scope.canvas.height);
    };

    function renderSections(sections, canvasWidth) {
      const imageWidth = 75;
      const imageHeight = 75;
      const spacing = 10;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = canvasWidth;
      let currentY = 0;

      sections.forEach((section) => {
        ctx.fillStyle = textColor;
        ctx.font = "bold 16px Arial";
        ctx.fillText(
          "----------- " + section.title + " ------------",
          0,
          currentY + 20
        );
        currentY += 30;

        if (section.type === "array") {
          section.data.forEach((item, index) => {
            const x = (imageWidth + spacing) * index;
            const y = currentY;

            const img = new Image();
            img.src = item.img_url;
            img.onload = () => {
              ctx.drawImage(img, x, y, imageWidth, imageHeight);
              ctx.fillStyle = textColor;
              ctx.font = "12px Arial";
              ctx.fillText(item.name, x, y + imageHeight + 15);
            };
          });

          currentY += imageHeight + 40; // 10px spacing + 30px text spacing
        } else if (section.type === "text") {
          ctx.fillStyle = textColor;
          ctx.font = "14px Arial";
          const lines = wrapText(
            ctx,
            section.data,
            canvasWidth,
            10,
            currentY + 20
          );
          currentY += lines * 20 + 20; // 20px spacing between lines
        }
      });

      return canvas;
    }

    function wrapText(context, text, maxWidth, x, y) {
      const words = text.split(" ");
      let line = "";
      let lineHeight = 0;
      let lines = 0;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y + lineHeight);
          line = words[n] + " ";
          lineHeight += 20; // 20px spacing between lines
          lines++;
        } else {
          line = testLine;
        }
      }

      lines++;
      context.fillText(line, x, y + lineHeight);
      return lines;
    }

    function drawLine(ctx, startX, startY, endX, endY) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // function getMaxLine(array, itemPerRow, maxWidth) {
    //   const words = text.split(' ');
    //   let line = '';
    //   for (let n = 0; n < words.length; n++) {
    //     const testLine = line + words[n] + ' ';
    //     const metrics = context.measureText(testLine);
    //     const testWidth = metrics.width;
    //     if (testWidth > maxWidth && n > 0) {
    //         context.fillText(line, x, y + lineHeight);
    //         line = words[n] + ' ';
    //         lineHeight += 20; // 20px spacing between lines
    //         lines++;
    //     } else {
    //         line = testLine;
    //     }
    //   }
    // }

    $scope.download = function () {
      // Convert canvas to image
      var canvasDataUrl = $scope.canvas.toDataURL("image/png");

      // Create a temporary anchor element to download the image
      var link = document.createElement("a");
      link.download = "canvas_image.png";
      link.href = canvasDataUrl;

      // Trigger the download
      link.click();
    };

    $scope.save = function () {
      $uibModalInstance.close("OK");
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
  }
);
