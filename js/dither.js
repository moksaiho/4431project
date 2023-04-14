(function(imageproc) {
    "use strict";

    /*
     * Apply ordered dithering to the input data
     */
    imageproc.dither = function(inputData, outputData, matrixType) {
        console.log("Applying dithering...");
        console.log(matrixType)
        /*
         * TODO: You need to extend the dithering processing technique
         * to include multiple matrix types
         */

        // At the moment, the code works only for the Bayer's 2x2 matrix
        // You need to include other matrix types
        
        // Set up the matrix
        switch(matrixType){
            case 'bayer2':
                console.log('this is bayer 2')
                var matrix = [ [1, 3], [4, 2] ];
                var levels = 5;
                break

            case 'bayer4':
                console.log('this is bayer 4')
                var matrix=[[1,9,3,11],[13,5,15,7],[4,12,2,10],[16,8,14,6]]
                var levels =17;
                break
            case 'line':
                var matrix=[[15,15,15,25],[15,15,25,15],[15,25,15,15],[25,15,15,15]]
                var levels =100;
                break
            case 'diamond':
                var matrix=[[15,25,15],[25,15,25],[15,25,15]]
                var levels = 100;


        }
       

        // The following code uses Bayer's 2x2 matrix to create the
        // dithering effect. You need to extend it to work for different
        // matrix types

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                var pixel = imageproc.getPixel(inputData, x, y);

                // Change the colour to grayscale and normalize it
                var value = (pixel.r + pixel.g + pixel.b) / 3;
                value = value / 255 * levels;

                // Get the corresponding threshold of the pixel
                
                switch(matrixType){
                    case 'bayer2':
                        var threshold = matrix[y % 2][x % 2];
                        break
                        
                    case 'bayer4':
                        var threshold = matrix[y % 4][x % 4];
                        break
                    case 'line':
                        var threshold = matrix[y % 4][x % 4];
                        break
                    case 'diamond':
                        var threshold = matrix[y % 3][x % 3];
                        break
                        
        
                }

                // Set the colour to black or white based on threshold
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     =
                outputData.data[i + 1] =
                outputData.data[i + 2] = (value < threshold)? 0 : 255;
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
