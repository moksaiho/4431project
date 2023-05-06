# 4431project
The project title: Extension of Kuwahara filter
Description:
The aim of this project is to implement an extended version of the Kuwahara filter
that uses other sectors like circular or hexagonal sectors instead of square
subregions. This approach can help to avoid the block structure of the output that
is caused by the Gibbs phenomenon in the original Kuwahara filter. By using other
shapes of sectors, the filter can better adapt to curved edges and corners in an
image. Additionally, Gaussian weighting can be used to further improve the
quality of the output.
To implement this filter, we can make use of some JavaScript libraries such as
p5.js and fabric.js and so on. We will need to modify the original Kuwahara
algorithm by replacing square subregions with circular and hexagonal sectors.
We will also need to adjust the weighting function used in each sector to account
for differences in shape and size. One possible approach is to use a Gaussian
weighting function that assigns higher weights to pixels closer to the center of
each sector.
Once we have implemented this algorithm, we can create a user-friendly interface
that allows users to select different sizes and shapes of circular or hexagonal
sectors, adjust Gaussian weighting parameters, and apply the filter in real-time.
We can also provide a side-by-side comparison view that displays filtered images
alongside their original counterparts.
Functionalities / Features:
- Implement a circular or hexagonal sector-based Kuwahara filter algorithm
- Allow users to select different sizes and shapes of sectors
- Provide options for adjusting Gaussian weighting parameters
- Enable users to apply the filter to images in real-time
- Display filtered images side-by-side with original images for comparison
purposes
- Enable users to import and download images
Overall, this project aims to provide a user-friendly implementation of an
advanced image filtering technique that can help enhance edges and corners in
images with curved features.
