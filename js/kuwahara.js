(function(imageproc) {
    "use strict";

    /*
     * Apply Kuwahara filter to the input data
     */
    imageproc.kuwahara = function(inputData, outputData, size,type='') {
        console.log("Applying Kuwahara filter...",type);
        // add circle below
        if(type=="square" || type=="circle"){

            function checkSector(x, y, cx, cy, sectorAngle) {
                var sector_index = 0;
                var locationArray = [];
                var angle = (Math.atan2(y - cy, x - cx) * (180.0 / Math.PI) + 360) % 360;

                for (var i = 0; i <= 360 - sectorAngle; i += sectorAngle) {
                    if (angle >= i && angle <= i + sectorAngle) {
                        locationArray.push(sector_index);
                    }

                    sector_index++;
                }

                return locationArray;
            }
            function circleRegionStat(x, y) {
            
                var sSize = parseInt($("#kuwahara-sector-size").val());
                // console.log('sSize',sSize)
                var boundary = Math.trunc($("#kuwahara-Gaussian-Factor").val()/2);
                var Gaussiansize=$("#kuwahara-Gaussian-Factor").val()
                var sectorArray = [];
                var result = [];
                for (var i = 0; i < sSize; i++) {
                    sectorArray[i] = [];
                }

                // Loop through each point and check if it is valid and which sector is it
                for (var i = x - boundary; i <= x + boundary; i++) {
                    for (var j = y - boundary; j <= y + boundary; j++) {
                        var distance = Math.hypot(i - x, j - y);

                        if (distance > Gaussiansize/2) {
                            continue;
                        }

                        var pixel = imageproc.getPixel(inputData, i, j);
                        var locationArray = checkSector(i, j, x, y, 360 / sSize);
                        for (var k = 0; k < locationArray.length; k++) {
                            sectorArray[locationArray[k]].push(pixel);
                        }
                    }
                }

                for (var i = 0; i < sSize; i++) {
                    var meanR = 0, meanG = 0, meanB = 0;
                    var divisor = sectorArray[i].length;
                    var meanValue = 0;
                    var variance = 0;

                    for (var j = 0; j < sectorArray[i].length; j++) {
                        /* For the mean colour */
                        var pixel = sectorArray[i][j];
                        meanR += pixel.r;
                        meanG += pixel.g;
                        meanB += pixel.b;

                        /* For the mean brightness */
                        meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                    }

                    meanR /= divisor;
                    meanG /= divisor;
                    meanB /= divisor;
                    meanValue /= divisor;

                    for (var j = 0; j < sectorArray[i].length; j++) {
                        var pixel = sectorArray[i][j];
                        var value = (pixel.r + pixel.g + pixel.b) / 3;

                        variance += Math.pow(value - meanValue, 2);

                        variance /= divisor;
                    }

                    result.push({
                        mean: {r: meanR, g: meanG, b: meanB},
                        variance: variance
                    }) 
                }
                // console.log('result is ',result)
                return result;
            }

            /*
            * TODO: You need to extend the kuwahara function to include different
            * sizes of the filter
            *
            * You need to clearly understand the following code to make
            * appropriate changes
            */

            /*
            * An internal function to find the regional stat centred at (x, y)
            */
            let small_kernel_size=parseInt((size+1)/2)
            let small_kernel_shift=parseInt((small_kernel_size-1)/2)
            let small_kernel_area=small_kernel_size*small_kernel_size

            function regionStat(x, y) {
                // Find the mean colour and brightness
                var meanR = 0, meanG = 0, meanB = 0;
                var meanValue = 0;
                for (var j = -small_kernel_shift; j <= small_kernel_shift; j++) {
                    for (var i = -small_kernel_shift; i <= small_kernel_shift; i++) {
                        var pixel = imageproc.getPixel(inputData, x + i, y + j);

                        // For the mean colour
                        meanR += pixel.r;
                        meanG += pixel.g;
                        meanB += pixel.b;

                        // For the mean brightness
                        meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                    }
                }
                meanR /= small_kernel_area;
                meanG /= small_kernel_area;
                meanB /= small_kernel_area;
                meanValue /= small_kernel_area;

                // Find the variance
                var variance = 0;
                for (var j = -small_kernel_shift; j <= small_kernel_shift; j++) {
                    for (var i = -small_kernel_shift; i <= small_kernel_shift; i++) {
                        var pixel = imageproc.getPixel(inputData, x + i, y + j);
                        var value = (pixel.r + pixel.g + pixel.b) / 3;

                        variance += Math.pow(value - meanValue, 2);
                    }
                }
                variance /= small_kernel_area;

                // Return the mean and variance as an object
                return {
                    mean: {r: meanR, g: meanG, b: meanB},
                    variance: variance
                };
            }

            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Find the statistics of the four sub-regions
                    if(type!=='circle'){
                    var regionA = regionStat(x - small_kernel_shift, y - small_kernel_shift, inputData);
                    var regionB = regionStat(x + small_kernel_shift, y - small_kernel_shift, inputData);
                    var regionC = regionStat(x - small_kernel_shift, y + small_kernel_shift, inputData);
                    var regionD = regionStat(x + small_kernel_shift, y + small_kernel_shift, inputData);

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
                else{
                    var i = (x + y * inputData.width) * 4;
                    // console.log('applying circle kuawahara')
                    
                    let sectorArray = circleRegionStat(x, y);
                    let dict={index:0,variance:Infinity}
                    sectorArray.forEach((item,idx)=>{
                        if(dict['variance']>=item.variance){
                            dict['variance']=item.variance
                            dict.index=idx
                        }
                    })
                    // console.log(dict.index,dict.variance)
                    outputData.data[i]     = sectorArray[dict['index']].mean.r;
                    outputData.data[i + 1] = sectorArray[dict['index']].mean.g;
                    outputData.data[i + 2] = sectorArray[dict['index']].mean.b;


                }

                }
            }


        }  



        else if(type=="hexagonal"){
            var sideLength= parseInt($("#kuwahara-Gaussian-Factor").val());
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
                        if ( (Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2)
                             && ((hexagon_r+1-j)/(hexagon_r+1-i)<=Math.sqrt(3))) {
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
                        if ((Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2)
                        && ((hexagon_r+1-j)/(hexagon_r+1-i)<=Math.sqrt(3))) {
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
                        if ( (Math.pow( Math.abs(i),2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2) 
                            && ((Math.abs(i)/(hexagon_r+1-j) <= Math.sqrt(3)/3 )) ){
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
                        if ((Math.pow( Math.abs(i),2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2) 
                        && ((Math.abs(i)/(hexagon_r+1-j) <= Math.sqrt(3)/3 ))) {
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
                        if ( (Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2)
                            && ((hexagon_r+1-j)/(hexagon_r+1+i)<=Math.sqrt(3)) ) {
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
                        if ((Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1-j,2) <= hexagon_r2)
                        && ((hexagon_r+1-j)/(hexagon_r+1+i)<=Math.sqrt(3))) {
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
                        if (  (Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2)
                            &&((hexagon_r+1+j)/(hexagon_r+1-i)<=Math.sqrt(3)) ) {
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
                        if ( (Math.pow(hexagon_r+1-i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2)
                        &&((hexagon_r+1+j)/(hexagon_r+1-i)<=Math.sqrt(3))) {
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
                        if (  (Math.pow(Math.abs(i),2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2 )
                            &&(Math.abs(i)/(hexagon_r+1+j)<=Math.sqrt(3)/3)) {
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
                        if (  (Math.pow(Math.abs(i),2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2 )
                        &&(Math.abs(i)/(hexagon_r+1+j)<=Math.sqrt(3)/3)) {
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
                        if ( (Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2) 
                            &&((hexagon_r+1+j)/(hexagon_r+1+i)<=Math.sqrt(3))) {
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
                        if ((Math.pow(hexagon_r+1+i,2) + Math.pow(hexagon_r+1+j,2) <= hexagon_r2) 
                        &&((hexagon_r+1+j)/(hexagon_r+1+i)<=Math.sqrt(3))) {
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


