(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    function get_mean_value(imageData, x, y){
        let pixel=imageproc.getPixel(imageData, x, y)
        let {r,g,b}=pixel
        return (r+g+b)/3
    }
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        console.log("Applying Sobel edge detection...");

        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * TODO: You need to write the code to apply
         * the two edge kernels appropriately
         */
        
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {




                var i = (x + y * outputData.width) * 4;
                // outputData.data[i]     = inputData.data[i];
                // outputData.data[i + 1] = inputData.data[i + 1];
                // outputData.data[i + 2] = inputData.data[i + 2];

                let Gx_value=get_mean_value(inputData, x+1, y+1)-get_mean_value(inputData, x-1, y+1)
                +2*get_mean_value(inputData, x+1, y)-2*get_mean_value(inputData, x-1, y)
                +get_mean_value(inputData, x+1, y-1)-get_mean_value(inputData, x-1, y-1)

                let Gy_value=get_mean_value(inputData, x-1, y+1)-get_mean_value(inputData, x-1, y-1)
                +2*get_mean_value(inputData, x, y+1)-2*get_mean_value(inputData, x, y-1)
                +get_mean_value(inputData, x+1, y+1)-get_mean_value(inputData, x+1, y-1)

                let value=Math.hypot(Gx_value,Gy_value)
              

                value=(value>threshold)?255:0
                
                outputData.data[i]     = value;
                outputData.data[i + 1] = value;
                outputData.data[i + 2] = value;
                


            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
