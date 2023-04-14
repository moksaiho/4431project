(function(imageproc) {
    "use strict";

    /*
     * Apply negation to the input data
     */
    imageproc.negation = function(inputData, outputData) {
        console.log("Applying negation...");
        console.log(outputData.data[0])
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]     = 255 - inputData.data[i];
            outputData.data[i + 1] = 255 - inputData.data[i + 1];
            outputData.data[i + 2] = 255 - inputData.data[i + 2];
        }
    }

    /*
     * Convert the input data to grayscale
     */
    imageproc.grayscale = function(inputData, outputData) {
        console.log("Applying grayscale...");

        /**
         * TODO: You need to create the grayscale operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
           
            // Change the RGB components to the resulting value
            let value=parseInt((inputData.data[i]+inputData.data[i+1]+inputData.data[i+2])/3)
            outputData.data[i]     = value;
            outputData.data[i + 1] = value;
            outputData.data[i + 2] = value;
        }
    }

    /*
     * Applying brightness to the input data
     */
    imageproc.brightness = function(inputData, outputData, offset) {
        console.log("Applying brightness...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by adding an offset

            outputData.data[i]     = (inputData.data[i]+offset)>255?255:inputData.data[i]+offset<0?0:inputData.data[i]+offset;
            outputData.data[i + 1] = (inputData.data[i+1]+offset)>255?255:inputData.data[i+1]+offset<0?0:inputData.data[i+1]+offset;
            outputData.data[i + 2] = (inputData.data[i+2]+offset)>255?255:inputData.data[i+2]+offset<0?0:inputData.data[i+2]+offset;

            // Handle clipping of the RGB components
        }
    }

    /*
     * Applying contrast to the input data
     */
    imageproc.contrast = function(inputData, outputData, factor) {
        console.log("Applying contrast...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by multiplying a factor

            outputData.data[i]     = inputData.data[i]*factor>255?255:inputData.data[i]*factor;
            outputData.data[i + 1] = inputData.data[i + 1]*factor>255?255:inputData.data[i+1]*factor;
            outputData.data[i + 2] = inputData.data[i + 2]*factor>255?255:inputData.data[i+2]*factor;

            // Handle clipping of the RGB components
        }
    }

    /*
     * Make a bit mask based on the number of MSB required
     */
    function makeBitMask(bits) {
        var mask = 0;
        for (var i = 0; i < bits; i++) {
            mask >>= 1;
            mask |= 128;
        }
        return mask;
    }

    /*
     * Apply posterization to the input data
     */
    imageproc.posterization = function(inputData, outputData,
                                       redBits, greenBits, blueBits) {
        console.log("Applying posterization...");

        /**
         * TODO: You need to create the posterization operation here
         */

        // Create the red, green and blue masks
        let redMask=makeBitMask(redBits)
        let greenMask=makeBitMask(greenBits)
        let blueMask=makeBitMask(blueBits)
        // A function makeBitMask() is already given

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Apply the bitmasks onto the RGB channels

            outputData.data[i]     = inputData.data[i]&redMask;
            outputData.data[i + 1] = inputData.data[i + 1]&greenMask;
            outputData.data[i + 2] = inputData.data[i + 2]&blueMask;
        }
    }

    /*
     * Apply threshold to the input data
     */
    imageproc.threshold = function(inputData, outputData, thresholdValue) {
        console.log("Applying thresholding...");

        /**
         * TODO: You need to create the thresholding operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
            // You will apply thresholding on the grayscale value
           let value=(inputData.data[i]+inputData.data[i+1]+inputData.data[i+2])/3
           value=value>thresholdValue?255:0
            // Change the colour to black or white based on the given threshold

            outputData.data[i]     = value;
            outputData.data[i + 1] = value;
            outputData.data[i + 2] = value;
        }
    }

    /*
     * Build the histogram of the image for a channel
     */
    function buildHistogram(inputData, channel) {
        var histogram = [];
        for (var i = 0; i < 256; i++)
            histogram[i] = 0;

        /**
         * TODO: You need to build the histogram here
         */

        // Accumulate the histogram based on the input channel
        // The input channel can be:
        // "red"   - building a histogram for the red component
        // "green" - building a histogram for the green component
        // "blue"  - building a histogram for the blue component
        // "gray"  - building a histogram for the intensity
        //           (using simple averaging)
        switch(channel){
            case 'red':
                for(var i=0;i<inputData.data.length;i+=4){
                    histogram[inputData.data[i]]+=1
                }
            case 'green':
                for(var i=0;i<inputData.data.length;i+=4){
                    histogram[inputData.data[i+1]]+=1
                }
            case 'blue':
                for(var i=0;i<inputData.data.length;i+=4){
                    histogram[inputData.data[i+2]]+=1
                }
            case 'gray':
                for(var i=0;i<inputData.data.length;i+=4){
                    let ave_val=parseInt((inputData.data[i]+inputData.data[i+1]+inputData.data[i+2])/3)
                    histogram[ave_val]+=1
                }
            
        }

        return histogram;
    }

    /*
     * Find the min and max of the histogram
     */
    function findMinMax(histogram, pixelsToIgnore) {
        var min = 0, max = 255;
        

        /**
         * TODO: You need to build the histogram here
         */

        // Find the minimum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
       
        // Find the maximum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        let keepRecord=pixelsToIgnore
        for (min=0;min<255;min++){
            
            if (histogram[min]>keepRecord)
            break
            else{
                keepRecord-=histogram[min]
            }
        }
        keepRecord=pixelsToIgnore
        for (max=255;max>0;max--){
            if (histogram[max]>keepRecord)
            break
            else{
                keepRecord-=histogram[max]
            }
        }
        return {"min": min, "max": max};
    }

    /*
     * Apply automatic contrast to the input data
     */
    imageproc.autoContrast = function(inputData, outputData, type, percentage) {
        console.log("Applying automatic contrast...");

        // Find the number of pixels to ignore from the percentage
        var pixelsToIgnore = (inputData.data.length / 4) * percentage;

        var histogram, minMax;
        if (type == "gray") {
            // Build the grayscale histogram
            histogram = buildHistogram(inputData, "gray");
            
            // Find the minimum and maximum grayscale values with non-zero pixels
            minMax = findMinMax(histogram, pixelsToIgnore);
            console.log(minMax)
            var min = minMax.min, max = minMax.max, range = max - min;

            /**
             * TODO: You need to apply the correct adjustment to each pixel
             */

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each pixel based on the minimum and maximum values

                outputData.data[i]     = parseInt((inputData.data[i]-min)/(max-min)*255)<=255?parseInt((inputData.data[i]-min)/(max-min)*255):255;
                outputData.data[i + 1] = parseInt((inputData.data[i+1]-min)/(max-min)*255)<=255?parseInt((inputData.data[i+1]-min)/(max-min)*255):255;
                outputData.data[i + 2] = parseInt((inputData.data[i+2]-min)/(max-min)*255)<=255?parseInt((inputData.data[i+2]-min)/(max-min)*255):255;
            }
        }
        else {
            let histogramR = buildHistogram(inputData, "red");
            let histogramG = buildHistogram(inputData, "green");
            let histogramB = buildHistogram(inputData, "blue");
            /**
             * TODO: You need to apply the same procedure for each RGB channel
             *       based on what you have done for the grayscale version
             */
            let minMaxR = findMinMax(histogramR, pixelsToIgnore);
       
            var minR = minMaxR.min, maxR = minMaxR.max, rangeR = max - min;
            let minMaxG = findMinMax(histogramG, pixelsToIgnore);
           
            var minG = minMaxG.min, maxG = minMaxG.max, rangeG = max - min;
            let minMaxB = findMinMax(histogramB, pixelsToIgnore);
           
            var minB = minMaxB.min, maxB = minMaxB.max, rangeB = max - min;

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each channel based on the histogram of each one

                outputData.data[i]     = parseInt((inputData.data[i]-minR)/(maxR-minR)*255);
                outputData.data[i + 1] = parseInt((inputData.data[i+1]-minG)/(maxG-minG)*255);
                outputData.data[i + 2] = parseInt((inputData.data[i+2]-minB)/(maxB-minB)*255);
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
