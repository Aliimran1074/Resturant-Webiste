import { imagekit } from "./config"

let uploadButton = document.getElementById('uploadButton')
uploadButton.addEventListener('click',upload())

var imageURL = imagekit.url({
    path : "/default-image.jpg",
    transformation : [{
        "height" : "300",
        "width" : "400"
    }]
  });
  
  // Upload function internally uses the ImageKit.io javascript SDK
  function upload() {
    console.log('Upload Function is running')
    var file = document.getElementById("file");
    // var imageURL = imagekit.url({
    //     path : `/${file.files[0].name}`,
    //     transformation : [{
    //         "height" : "300",
    //         "width" : "400"
    //     }]
    //   });
      
    imagekit.upload({
        file : file.files[0],
        fileName : file.files[0].name,
        tags : ["tag1"],
        
    }, function(err, result) {
        console.log(arguments);
        console.log(imagekit.url({
            src: result.url,
            transformation : [{ height: 300, width: 400}]
        }));
        if(err){
            console.log("Error in add Image")
        }
    })
  }
// const addImage=()=>{

// }