app.controller(
  "ExportModalController",
  function ($scope, $uibModalInstance, WishlistService, wishlist) {
    $scope.wishlist = wishlist ?? {};
    $scope.element = angular.element(
      document.getElementById("export-template")
    );
    $scope.canvas = null;
    const setting = WishlistService.getSetting();

    function preCalulteCanvasHeight()
    {

    }

    function calculateImagesPerRow(
      canvasWidth,
      imageWidth,
      numberOfImages,
      spacingBetweenImages
    ) {
      // Calculate total width taken by images and spacing
      const totalWidthTaken =
        numberOfImages * imageWidth +
        (numberOfImages + 1) * spacingBetweenImages;

      // Calculate number of rows
      const rows = Math.ceil(totalWidthTaken / canvasWidth);

      // Calculate number of images per row
      const imagesPerRow = Math.ceil(numberOfImages / rows);

      return imagesPerRow;
    }

    function recalculateSpacingX(canvasWidth, imageWidth, numberOfImages) {
      return (canvasWidth - numberOfImages * imageWidth) / (numberOfImages + 1);
    }

    $scope.draw = function () {
      $scope.canvas = document.getElementById("myCanvas");
      let ctx = $scope.canvas.getContext("2d");

      // Define constants for layout
      let startX = 20; // X-coordinate of the starting position
      let startY = 70; // Y-coordinate of the starting position
      let imageSizeMultiply = 2.5;
      let imageWidth = 100 * imageSizeMultiply; // Width of each image
      let imageHeight = 100 * imageSizeMultiply; // Height of each image
      let spacingX = 20; // Horizontal spacing between images
      let spacingY = 20; // Vertical spacing between rows
      let aspectRatio = 16/9;

      // Title
      let sectionColor = "#818CF8";
      let titleFontSize = 24;
      let sectionPadding = 100;

      // Line
      let lineWidth = 2;
      let lineColor = "#f0abfc";

      // Text
      let fontSize = 18; // Font size for title and name
      let textColor = "#FFFFFF";
      let textPadding = 10; // Padding between text and images

      // Calculate
      let imagesPerRow = 5

      // Precalculate
      let preCalHeight = startY;
      $scope.wishlist.forEach(function (section, i) {
        preCalHeight += titleFontSize + sectionPadding + spacingY * 1.5;
        if (section.type == "array" && section.data.length > 0) {
          let numRows = Math.ceil(section.data.length / imagesPerRow)
          preCalHeight += numRows * (imageHeight + fontSize + textPadding)
        }
        if (section.type == "text" && !isBlank(section.data)) {
          let text = section.data;
          let textArray = text.split(/^/gm)
          preCalHeight += textArray.length * (fontSize + spacingY * 2)
        }
      })

      let preCalWidth = Math.ceil(preCalHeight / aspectRatio)
      $scope.canvas.width = 1430
      $scope.canvas.height = preCalHeight

      // Clear the canvas
      ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);

      // Gradient background
      // $scope.canvas.height = $scope.canvas.clientHeight
      // $scope.canvas.width = $scope.canvas.clientWidth
      const centerX = $scope.canvas.width / 2;
      const centerY = $scope.canvas.height / 2;
      const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, $scope.canvas.width / 2);
      grad.addColorStop(0, "#65538A");
      grad.addColorStop(0.3, "#333150");
      grad.addColorStop(1, "#121212");
      
      // Fill rectangle with gradient
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, $scope.canvas.width, $scope.canvas.height);

      let rowCount = 0;
      let tempCanvasHeigh = 0;
      $scope.wishlist.forEach(function (section, index) {
        if (section.type == "text" && isBlank(section.data) || (section.type == "array" && section.data.length == 0)) {
          return;
        }

        if (section.type == "array" && section.data.length > 4) {
          let maxItems = getMaxItem();
          imagesPerRow = calculateImagesPerRow(
            $scope.canvas.width,
            imageWidth,
            maxItems,
            spacingX
          );
          spacingX = recalculateSpacingX(
            $scope.canvas.width,
            imageWidth,
            imagesPerRow
          );
        }
        
        if (index > 0) {
          rowCount += Math.ceil(
            $scope.wishlist[index - 1].data.length / imagesPerRow
          );
        }

        //#region Render Section title
        ctx.font = titleFontSize + "px Arial";
        let titleX = spacingX;
        let titleY =
          startY +
          (imageHeight + titleFontSize + spacingY) * rowCount +
          (sectionPadding * index);
        titleY += spacingY * 1.5 * index;
        // tempCanvasHeigh = titleY;
        ctx.fillStyle = sectionColor;
        ctx.fillText(section.title, titleX, titleY);
        // tempCanvasHeigh += titleY;
        //#endregion

        //#region Render Line under section title
        let lineY = titleY + spacingY - spacingY / 2;
        drawLine(
          ctx,
          spacingX,
          lineY,
          $scope.canvas.width / 2 - spacingX,
          lineY,
          lineColor
        );
        //#endregion

        if (section.type == "array" && section.data.length > 0) {
          let maxLine = 1;
          let sectionRowsMaxline = {
            0: 1,
            1: 1
          }
          let current_row = 1;
          section.data.forEach(function (keycap, i) {
            let img = new Image();
            img.onload = function () {
              let row = Math.floor(i / imagesPerRow);
              let col = i % imagesPerRow;

              if (row != current_row) {
                current_row = row;
                sectionRowsMaxline[index] = 1
              }

              let imageX = (spacingX + imageWidth) * col + spacingX;
              let imageY =
                titleY +
                (1.5) * spacingY +
                row * spacingY +
                fontSize +
                (fontSize * sectionRowsMaxline[index] - 1) * row +
                textPadding +
                row * (imageHeight + spacingY);

              drawRoundedImage(
                ctx,
                img,
                imageX,
                imageY,
                imageWidth,
                imageHeight,
                8
              );

              ctx.font = fontSize + "px Arial";
              ctx.fillStyle = textColor;
              let textWidth = ctx.measureText(keycap.name).width;
              if (keycap.name) {
                let line = wrapText(ctx, keycap.name, imageWidth, imageX, imageY + imageHeight + spacingY, true);
                if (line > sectionRowsMaxline[i]) {
                  sectionRowsMaxline[index] = line
                }
              }
              // console.log("Section " + index + ": " + maxLine)
              // ctx.fillText(
              //   keycap.name ?? "",
              //   imageX + (imageWidth - textWidth) / 2,
              //   imageY + imageHeight + spacingY
              // );

              // End of line then update tempCanvasHeight
              // if (i + 1 == imagesPerRow) {
              //   tempCanvasHeigh += (imageY + imageHeight + spacingY)
              //   // console.log(tempCanvasHeigh)
              // }
            };
            img.src = keycap.img_url;
          });
        }

        if (section.type == "text" && !isBlank(section.data)) {
          ctx.font = fontSize + "px Arial";
          let text = section.data;
          let textArray = text.split(/^/gm)
          let numberOfLine = 0;
          textArray.forEach(function (line, i) {
            numberOfLine += wrapText(
              ctx,
              line,
              $scope.canvas.width - 2 * spacingX,
              spacingX,
              titleY + fontSize + spacingY * (numberOfLine + index)
            ) + 1
          })

          // tempCanvasHeigh += titleY + fontSize + textPadding + (line + 1) * (20 + fontSize)
          // console.log('123');
        }
      });

      // // Set canvas background to white
      // ctx.fillStyle = $scope.setting.general.background_color;
      // ctx.fillRect(0, 0, $scope.canvas.width, $scope.canvas.height);
    };

    function isBlank(str) {
      return (!str || /^\s*$/.test(str));
  }

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

    function wrapText(context, text, maxWidth, x, y, is_center = false) {
      const words = text.split(" ");
      let line = "";
      let lineHeight = 0;
      let lines = 0;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          if (is_center) {
            context.fillText(line, x + (maxWidth - context.measureText(line.trim()).width) / 2, y + lineHeight);
          } else {
            context.fillText(line, x, y + lineHeight)
          }
          line = words[n] + " ";
          lineHeight += 20; // 20px spacing between lines
          lines++;
        } else {
          line = testLine;
        }
      }

      lines++;
      if (is_center) {
        context.fillText(line, x + (maxWidth - context.measureText(line.trim()).width) / 2, y + lineHeight);
      } else {
        context.fillText(line, x, y + lineHeight)
      }
      return lines;
    }

    function drawRoundedImage(ctx, image, x, y, width, height, radius) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
      ctx.clip(); // Set the clipping region to the rounded area
      ctx.drawImage(image, x, y, width, height); // Draw the image within the clipping region
      ctx.restore();
    }

    function drawLine(ctx, startX, startY, endX, endY, color) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function getMaxItem() {
      let maxItems = 0;
      $scope.wishlist.forEach((section, index) => {
        if (index != 2) {
          let max = section.data.length;
          if (max > maxItems) {
            maxItems = max;
          }
        }
      });

      return maxItems;
    }

    $scope.download = function () {
      // Convert canvas to image
      let canvasDataUrl = $scope.canvas.toDataURL("image/png");

      // Create a temporary anchor element to download the image
      let link = document.createElement("a");
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
