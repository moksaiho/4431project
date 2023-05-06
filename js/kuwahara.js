(function(imageproc) {
    "use strict";

    /*
     * Apply Kuwahara filter to the input data
     */
    imageproc.kuwahara = function(inputData, outputData, size, type) {
        console.log("Applying Kuwahara filter...");

        /*
         * TODO: You need to extend the kuwahara function to include different
         * sizes of the filter
         *
         * You need to clearly understand the following code to make
         * appropriate changes
         */
        if(type=="original"){
            var sub_ker=parseInt((size+1)/2);
            var half_ker=parseInt((sub_ker-1)/2);
            /*
            * An internal function to find the regional stat centred at (x, y)
            */
            function regionStat(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                for (var j = -half_ker; j <= half_ker; j++) {
                    for (var i = -half_ker; i <= half_ker; i++) {
                        var pixel = imageproc.getPixel(inputData, x + i, y + j);

                        // For the mean colour
                        meanR += pixel.r;
                        meanG += pixel.g;
                        meanB += pixel.b;

                        // For the mean brightness
                        meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                    }
                }
                meanR /= (sub_ker*sub_ker);
                meanG /= (sub_ker*sub_ker);
                meanB /= (sub_ker*sub_ker);
                meanValue /= (sub_ker*sub_ker);

                // Find the variance
                var variance = 0;
                for (var j = -half_ker; j <= half_ker; j++) {
                    for (var i = -half_ker; i <= half_ker; i++) {
                        var pixel = imageproc.getPixel(inputData, x + i, y + j);
                        var value = (pixel.r + pixel.g + pixel.b) / 3;

                        variance += Math.pow(value - meanValue, 2);
                    }
                }
                variance /= (sub_ker*sub_ker);

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }

            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Find the statistics of the four sub-regions
                    var regionA = regionStat(x - half_ker, y - half_ker, inputData);
                    var regionB = regionStat(x + half_ker, y - half_ker, inputData);
                    var regionC = regionStat(x - half_ker, y + half_ker, inputData);
                    var regionD = regionStat(x + half_ker, y + half_ker, inputData);

                    // Get the minimum variance value
                    var minV = Math.min(regionA.variance, regionB.variance,
                                        regionC.variance, regionD.variance);

                    var i = (x + y * inputData.width) * 4;

                    // Put the mean colour of the region with the minimum
                    // variance in the pixel
                    switch (minV) {
                    case regionA.variance:
                        outputData.data[i]     = regionA.mean.r;
                        outputData.data[i + 1] = regionA.mean.g;
                        outputData.data[i + 2] = regionA.mean.b;
                        break;
                    case regionB.variance:
                        outputData.data[i]     = regionB.mean.r;
                        outputData.data[i + 1] = regionB.mean.g;
                        outputData.data[i + 2] = regionB.mean.b;
                        break;
                    case regionC.variance:
                        outputData.data[i]     = regionC.mean.r;
                        outputData.data[i + 1] = regionC.mean.g;
                        outputData.data[i + 2] = regionC.mean.b;
                        break;
                    case regionD.variance:
                        outputData.data[i]     = regionD.mean.r;
                        outputData.data[i + 1] = regionD.mean.g;
                        outputData.data[i + 2] = regionD.mean.b;
                    }
                }
            }
        }

        else if(type=="hexagonal"){
            var sideLength= size;

            var sub_ker = sideLength;
            var half_ker = parseInt((sub_ker - 1) / 2);
            var hexagon_r = half_ker;
            var hexagon_r2 = sideLength * sideLength;

            function hexregionStat_A(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                var pixelCount = 0;

                // Loop over all pixels in the hexagon filter kernel
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if ( Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2 ) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);

                            // For the mean colour
                            meanR += pixel.r;
                            meanG += pixel.g;
                            meanB += pixel.b;

                            // For the mean brightness
                            meanValue += (pixel.r + pixel.g + pixel.b) / 3;

                            pixelCount++;
                        }
                    }
                }

                meanR /= pixelCount;
                meanG /= pixelCount;
                meanB /= pixelCount;
                meanValue /= pixelCount;

                // Find the variance
                var variance = 0;
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if (Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);
                            var value = (pixel.r + pixel.g + pixel.b) / 3;

                            variance += Math.pow(value - meanValue, 2);
                        }
                    }
                }
                variance /= pixelCount;

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }


            function hexregionStat_B(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                var pixelCount = 0;

                // Loop over all pixels in the hexagon filter kernel
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if ( Math.pow(hexagon_r+1+ Math.abs(i),2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2 ) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);

                            // For the mean colour
                            meanR += pixel.r;
                            meanG += pixel.g;
                            meanB += pixel.b;

                            // For the mean brightness
                            meanValue += (pixel.r + pixel.g + pixel.b) / 3;

                            pixelCount++;
                        }
                    }
                }

                meanR /= pixelCount;
                meanG /= pixelCount;
                meanB /= pixelCount;
                meanValue /= pixelCount;

                // Find the variance
                var variance = 0;
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if (Math.pow(hexagon_r+1+ Math.abs(i),2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);
                            var value = (pixel.r + pixel.g + pixel.b) / 3;

                            variance += Math.pow(value - meanValue, 2);
                        }
                    }
                }
                variance /= pixelCount;

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }

            function hexregionStat_C(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                var pixelCount = 0;

                // Loop over all pixels in the hexagon filter kernel
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if ( Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2 ) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);

                            // For the mean colour
                            meanR += pixel.r;
                            meanG += pixel.g;
                            meanB += pixel.b;

                            // For the mean brightness
                            meanValue += (pixel.r + pixel.g + pixel.b) / 3;

                            pixelCount++;
                        }
                    }
                }

                meanR /= pixelCount;
                meanG /= pixelCount;
                meanB /= pixelCount;
                meanValue /= pixelCount;

                // Find the variance
                var variance = 0;
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if (Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);
                            var value = (pixel.r + pixel.g + pixel.b) / 3;

                            variance += Math.pow(value - meanValue, 2);
                        }
                    }
                }
                variance /= pixelCount;

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }

            function hexregionStat_D(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                var pixelCount = 0;

                // Loop over all pixels in the hexagon filter kernel
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if (  Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2 ) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);

                            // For the mean colour
                            meanR += pixel.r;
                            meanG += pixel.g;
                            meanB += pixel.b;

                            // For the mean brightness
                            meanValue += (pixel.r + pixel.g + pixel.b) / 3;

                            pixelCount++;
                        }
                    }
                }

                meanR /= pixelCount;
                meanG /= pixelCount;
                meanB /= pixelCount;
                meanValue /= pixelCount;

                // Find the variance
                var variance = 0;
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if ( Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);
                            var value = (pixel.r + pixel.g + pixel.b) / 3;

                            variance += Math.pow(value - meanValue, 2);
                        }
                    }
                }
                variance /= pixelCount;

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }

            function hexregionStat_E(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                var pixelCount = 0;

                // Loop over all pixels in the hexagon filter kernel
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if (  Math.pow(hexagon_r+1+Math.abs(i),2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2 ) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);

                            // For the mean colour
                            meanR += pixel.r;
                            meanG += pixel.g;
                            meanB += pixel.b;

                            // For the mean brightness
                            meanValue += (pixel.r + pixel.g + pixel.b) / 3;

                            pixelCount++;
                        }
                    }
                }

                meanR /= pixelCount;
                meanG /= pixelCount;
                meanB /= pixelCount;
                meanValue /= pixelCount;

                // Find the variance
                var variance = 0;
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if ( Math.pow(hexagon_r+1+Math.abs(i),2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);
                            var value = (pixel.r + pixel.g + pixel.b) / 3;

                            variance += Math.pow(value - meanValue, 2);
                        }
                    }
                }
                variance /= pixelCount;

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }


            function hexregionStat_F(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                var pixelCount = 0;

                // Loop over all pixels in the hexagon filter kernel
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if ( Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2 ) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);

                            // For the mean colour
                            meanR += pixel.r;
                            meanG += pixel.g;
                            meanB += pixel.b;

                            // For the mean brightness
                            meanValue += (pixel.r + pixel.g + pixel.b) / 3;

                            pixelCount++;
                        }
                    }
                }

                meanR /= pixelCount;
                meanG /= pixelCount;
                meanB /= pixelCount;
                meanValue /= pixelCount;

                // Find the variance
                var variance = 0;
                for (var j = -hexagon_r; j <= hexagon_r; j++) {
                    for (var i = -hexagon_r; i <= hexagon_r; i++) {
                        // Check if pixel is inside the hexagon filter kernel
                        if (Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2) {
                            var pixel = imageproc.getPixel(inputData, x + i, y + j);
                            var value = (pixel.r + pixel.g + pixel.b) / 3;

                            variance += Math.pow(value - meanValue, 2);
                        }
                    }
                }
                variance /= pixelCount;

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }

            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Find the statistics of the four sub-regions
                    var regionA = hexregionStat_A(x - half_ker, y - half_ker, inputData);
                    var regionB = hexregionStat_B(x, y - half_ker, inputData);
                    var regionC = hexregionStat_C(x + half_ker, y - half_ker, inputData);
                    var regionD = hexregionStat_D(x - half_ker, y + half_ker, inputData);
                    var regionE = hexregionStat_E(x, y + half_ker, inputData);
                    var regionF = hexregionStat_F(x + half_ker, y + half_ker, inputData);

                    // Get the minimum variance value
                    var minV = Math.min(regionA.variance, regionB.variance,
                                        regionC.variance, regionD.variance,
                                        regionE.variance, regionF.variance);

                    var i = (x + y * inputData.width) * 4;

                    // Put the mean colour of the region with the minimum
                    // variance in the pixel
                    switch (minV) {
                        case regionA.variance:
                            outputData.data[i]     = regionA.mean.r;
                            outputData.data[i + 1] = regionA.mean.g;
                            outputData.data[i + 2] = regionA.mean.b;
                            break;
                        case regionB.variance:
                            outputData.data[i]     = regionB.mean.r;
                            outputData.data[i + 1] = regionB.mean.g;
                            outputData.data[i + 2] = regionB.mean.b;
                            break;
                        case regionC.variance:
                            outputData.data[i]     = regionC.mean.r;
                            outputData.data[i + 1] = regionC.mean.g;
                            outputData.data[i + 2] = regionC.mean.b;
                            break;
                        case regionD.variance:
                            outputData.data[i]     = regionD.mean.r;
                            outputData.data[i + 1] = regionD.mean.g;
                            outputData.data[i + 2] = regionD.mean.b;
                            break;
                        case regionE.variance:
                            outputData.data[i]     = regionE.mean.r;
                            outputData.data[i + 1] = regionE.mean.g;
                            outputData.data[i + 2] = regionE.mean.b;
                            break;
                        case regionF.variance:
                            outputData.data[i]     = regionF.mean.r;
                            outputData.data[i + 1] = regionF.mean.g;
                            outputData.data[i + 2] = regionF.mean.b;
                            break;
                    }
                }
            }
        }        
    }
 
}(window.imageproc = window.imageproc || {}));
