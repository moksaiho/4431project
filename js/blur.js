(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        console.log("Applying blur...");
        // console.log(kernelSize)
        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [ [1, 1, 1], [1, 1, 1], [1, 1, 1] ];
        let kernel_start=parseInt((kernelSize-1)/2)
        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel

                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                // outputData.data[i]     = inputData.data[i];
                // outputData.data[i + 1] = inputData.data[i + 1];
                // outputData.data[i + 2] = inputData.data[i + 2];
                let r_value=0
                let g_value=0
                let b_value=0
                for (let h=-kernel_start;h<=kernel_start;h++){
                    for (let w=-kernel_start;w<=kernel_start;w++){
                       
                        r_value+=imageproc.getPixel(inputData,x+w,y+h).r
                        g_value+=imageproc.getPixel(inputData,x+w,y+h).g
                        b_value+=imageproc.getPixel(inputData,x+w,y+h).b
                    }
                }
                outputData.data[i]     = parseInt(r_value/(kernelSize*kernelSize));
                outputData.data[i + 1] = parseInt(g_value/(kernelSize*kernelSize));
                outputData.data[i + 2] = parseInt(b_value/(kernelSize*kernelSize));
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
