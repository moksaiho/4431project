$(document).ready(function() {
   

    $('#file').change((e)=>{
        // console.log(this)
        let the_file=e.target.files[0]
        const {name} = the_file
        let pattern = /^image/
        if(!pattern.test(the_file.type)){
            alert("wrong data type! please give an image")
        }
        else{
            let reader = new FileReader()
            reader.readAsDataURL(the_file)
            reader.onload=(e)=>{

                let image = new Image();  
            image.onload = function(){  
                var width = image.width;
                var height = image.height;  
                
                if (width == 480 & height == 360){
                  
                    const newImg = document.createElement("option");
                newImg.innerHTML =name;
                newImg.setAttribute('base64URL',e.target.result)
                document.getElementById("input-image").appendChild(newImg);
                alert('add image successful!')
                }else {
                    alert('文件像素宽：' + width +'，文件像素高：'+ height +",文件尺寸应为:480*360(像素)!");
                    document.getElementById("file").value = "";
                    return false;
                }
            }
            image.src= e.target.result;               
            }
        }
    })
});
