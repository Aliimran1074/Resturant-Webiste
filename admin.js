import { app } from "./config.js"
import { getFirestore, collection, addDoc, getDocs, doc, onSnapshot, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"
import { getAuth, onAuthStateChanged, signOut, updatePassword,reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const dataBase = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)
const user = auth.currentUser;

if (document.title === 'Add Items') {

  onAuthStateChanged(auth, async(user) => {   //check current user is admin or not
    if (user) {
      const uid = user.uid;
      console.log("User ID ", uid)
      console.log('User Email', user.email)
      let adminFound =false
      const querySnapshot = await getDocs(collection(dataBase, "adminSignUp"));

for(let i=0;i<querySnapshot.docs.length;i++){
  if(querySnapshot.docs[i].data().email==user.email){
    adminFound=true
    break
  }
}
if(!adminFound){
    console.log('Not available')
      Swal.fire({
        title: "Not Login As Admin",
        icon: "error",
        background: 'black',
        color: 'red'
      });
      setTimeout(() => {
        window.location.href = './loginAsAdmin.html'
  
      }, 3000)
      console.log('Not allowed')
  
}
else{

  let addButton = document.querySelector('#addButton')
  let picUpload = document.querySelector('#uploadPic')
  let itemName = document.querySelector('#itemName')
  let itemPrice = document.querySelector('#itemPrice')
  let itemDiscription = document.getElementById('itemDiscription')
  let imageUrl
  addButton.addEventListener('click', async () => {
    if (itemName.value == '' || itemPrice.value == '' || itemDiscription == '') {       //all fields filling required
      Swal.fire({
        icon: "warning",
        title: "Please Fill all required the fields",
        background: 'black',
        color: 'white'
      });
    }
    else {
      try {
        // console.log("File Name :" + picUpload.files[0].name)
        let storageRef = ref(storage, `images/${picUpload.files[0].name}`)
        const uploadTask = uploadBytesResumable(storageRef, picUpload.files[0])
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + Math.round(progress) + '% done')

            if (progress < 100) {
              let timerInterval
              Swal.fire({
                title: "Uploading..",
                html: `${Math.round(progress)}% done`,
                timer: 10000,
                timerProgressBar: true,
                background: 'black',
                color: 'white',
                didOpen: () => {
                  Swal.showLoading();
                },
                willClose: () => {
                  clearInterval(timerInterval);
                }
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                  console.log("I was closed by the timer");
                }
              });
            }

            else if (progress == 100) {
              Swal.fire({
                title: "Added  Successfully",
                icon: "success",
                background: 'black',
                color: 'aqua'
              });
            }

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (error) => {
            console.log(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                imageUrl = downloadURL
                console.log('File available at', imageUrl)

                // Now that imageUrl is available, add the document to Firestore
                addDataToFirestore()
              })
              .catch((error) => {
                console.log(error)
              })
          }
        )
      } catch (e) {
        Swal.fire({
          icon: "warning",
          title: "Please upload picture also",
          background: 'black',
          color: 'white'
        });
      }
    }
    async function addDataToFirestore() {
      try {
        const docRef = await addDoc(collection(dataBase, "data/"), {
          itemName: itemName.value,
          itemPrice: itemPrice.value,
          itemDiscription: itemDiscription.value,
          imageUrl: imageUrl
        })

        console.log("Document written with ID: ", docRef.id)
        console.log('Data stored Successfully')
      } catch (e) {
        console.log("Error adding document: ", e.message)
      }
      itemName.value = ''
      itemPrice.value = ''
      itemDiscription.value = ''
      picUpload.value = ''
    }
  }

  )
}
    }
    else {
      console.log('Not available')
      Swal.fire({
        title: "Login First",
        icon: "error",
        background: 'black',
        color: 'red'
      });
      setTimeout(() => {
        window.location.href = './loginAsAdmin.html'

      }, 3000)
      console.log('Not allowed')

    }

})
}


else if (document.title === 'Admin') {
  let rowDiv = document.getElementById('divRow')    //getting div showing whole data

  // const user = firebase.auth().currentUser;
  // user.updateEmail("new-email@example.com")
  //   .then(() => {
  //     console.log("Email updated successfully");
  //   })
  //   .catch((error) => {
  //     console.error("Error updating email:", error);
  //   });


  // const user = firebase.auth().currentUser;
  // const newPassword = "new-password123";

  // user.updatePassword(newPassword)
  //   .then(() => {
  //     console.log("Password updated successfully");
  //   })
  //   .catch((error) => {
  //     console.error("Error updating password:", error);
  //   });

onAuthStateChanged(auth, async(user) => {         //check the user is admin or not
    if (user) {
      const uid = user.uid
      console.log("User ID ", uid)
      console.log('User Email', user.email)
      let adminFound =false
      const querySnapshot = await getDocs(collection(dataBase, "adminSignUp"));

for(let i=0;i<querySnapshot.docs.length;i++){
  if(querySnapshot.docs[i].data().email==user.email){
    adminFound=true
    break
  }
  
}
if(!adminFound){
  
    console.log('Not available')
      Swal.fire({
        title: "Not Login As Admin",
        icon: "error",
        background: 'black',
        color: 'red'
      });
      setTimeout(() => {
        window.location.href = './loginAsAdmin.html'
  
      }, 3000)
      console.log('Not allowed')
  
}
else{



      let getData = () => {

        onSnapshot(collection(dataBase, "data"), (data) => {      //get life data from dataBase
          // console.log(data)
          data.docChanges().forEach((newData) => {
            console.log(newData)

            if (newData.type == 'removed') {
              let deleted = document.getElementById(newData.doc.id)     
              console.log(deleted)
              Swal.fire({
                title: "Deleted Successfully",
                icon: "success",
                background: 'black',
                color: 'red'
              });
              deleted.remove()
            }

            else if (newData.type == 'added') {       //when data added update interface
              rowDiv.innerHTML += ` <div class="col-md-4 mt-4" id="${newData.doc.id}">
          <div class="card" style="width: 18rem;" >
              <img src="${newData.doc.data().imageUrl}" class="card-img-top" width='100px' height='200px' alt="abc">
              <div class="card-body">
                  <h5 class="card-title">${newData.doc.data().itemName}</h5>
                  <h3 class="card-title" >Price : <span class="card-price">${newData.doc.data().itemPrice}</span></h3>
                  <p class="card-text">${newData.doc.data().itemDiscription}.</p>
                  <button class="btn btn-lg btn-warning "onclick="edit(this,'${newData.doc.id}')" >Edit</button>
                  <button class="btn btn-lg btn-danger " onclick="delData('${newData.doc.id}')">Delete</button>
              </div>
          </div>
      </div> `
            }
          })
        })

      }

      async function delData(id) {
        await deleteDoc(doc(dataBase, "data", id))        //element will delete from dataBase
      }

      async function edit(e, id) {
        let titleElement = e.parentNode.querySelector('.card-title')
        let titleText = titleElement.innerText // Use innerText to get the text content

        let priceElement = e.parentNode.querySelector('.card-price');
        let priceText = priceElement.innerText

        let discriptionElement = e.parentNode.querySelector('.card-text');
        let discriptionText = discriptionElement.innerText

        
        const { value: formValues } = await Swal.fire({
          title: "Edit Here",
          html: `
          <input id="swal-input1" type='text' class="swal2-input" placeholder="Enter Title Here" value='${titleText}'>
          <input id="swal-input2" type='number' class="swal2-input" placeholder="Enter price Here" value='${priceText}'>
          <input id="swal-input3" type='text' class="swal2-input" placeholder="Enter Discription Here" value='${discriptionText}'>
        `,
          background: 'black',
          color: 'white',
          focusConfirm: false,
          preConfirm: () => {
            let titleVal = document.getElementById("swal-input1").value
            let priceVal = document.getElementById("swal-input2").value
            let discriptionVal = document.getElementById("swal-input3").value

            return [titleVal, priceVal, discriptionVal];
          }
        })

        if (formValues) {
          Swal.fire(JSON.stringify(formValues))     //convert object into string
        }
        if (formValues[0] == '' || formValues[1] == '' || formValues[2] == '') {
          Swal.fire({
            icon: "error",
            title: "Write Something to edit ",
            background: 'black',
            color: 'white'
          });
        }

        else if (formValues[0] != '' && formValues[1] != '' && formValues[2] != '') {
          titleText = formValues[0]
          priceText = formValues[1]
          discriptionText = formValues[2]

          await updateDoc(doc(dataBase, "data", id), {
            itemName: titleText,
            itemPrice: priceText,
            itemDiscription: discriptionText
          })

          // Update the corresponding HTML element with the new data
          let editedCard = document.getElementById(id)
          // console.log(editedCard.querySelector('.card-img-top').src)
          editedCard.innerHTML = `
          <div class="card" style="width: 18rem;">
              <img src="${editedCard.querySelector('.card-img-top').src}" class="card-img-top" width='100px' height='200px' alt="abc">
              <div class="card-body">
                  <h5 class="card-title">${formValues[0]}</h5>
                  <h3 class="card-title">Price : <span class="card-price">${formValues[1]}</span></h3>
                  <p class="card-text">${formValues[2]}.</p>
                  <button class="btn btn-lg btn-warning" onclick="edit(this, '${id}')">Edit</button>
                  <button class="btn btn-lg btn-danger" onclick="delData('${id}')">Delete</button>
              </div>
          </div>`
        }


      }

      window.delData = delData
      window.edit = edit
      getData()
    } 
  }   
    else {
      console.log('Not available')
      Swal.fire({
        title: "Login First",
        icon: "error",
        background: 'black',
        color: 'red'
      });
      setTimeout(() => {
        window.location.href = './loginAsAdmin.html'

      }, 3000)
      console.log('Not allowed')

    }
  })
}


else if (document.title == 'Order') {
 
  onAuthStateChanged(auth, async(user) => {     //check user is admin or not
    if (user) {
      const uid = user.uid;
      console.log("User ID ", uid)
      console.log('User Email', user.email)
      let adminFound =false
      const querySnapshot = await getDocs(collection(dataBase, "adminSignUp"));

for(let i=0;i<querySnapshot.docs.length;i++){
  if(querySnapshot.docs[i].data().email==user.email){
    adminFound=true
    break
  }
}
if(!adminFound){
    console.log('Not available')
      Swal.fire({
        title: "Not Login As Admin",
        icon: "error",
        background: 'black',
        color: 'red'
      });
      setTimeout(() => {
        window.location.href = './loginAsAdmin.html'
  
      }, 3000)
      console.log('Not allowed')
  
}
else{
 
  let tableBody = document.getElementById('tableBody')
  let selector= document.querySelector('#selector')
  
  let getData = () => {
    tableBody.innerHTML = '' // Clear the table before appending new data 
    
    onSnapshot(collection(dataBase, "order"), (data) => {
        
      let dataArray = []          //empty array will sort data here
      
      data.docChanges().forEach((newData) => {
            dataArray.push(newData.doc.data())      //pushing data in array
        })

        if (selector.selectedIndex === 0) {            // Selection sort for sorting by date
           
            for (let i = 0; i < dataArray.length - 1; i++) {
                let minIndex = i;
                for (let j = i + 1; j < dataArray.length; j++) {
                    if (dataArray[j].date < dataArray[minIndex].date) {
                        minIndex = j
                    }
                }
                let temp = dataArray[i];
                dataArray[i] = dataArray[minIndex];
                dataArray[minIndex] = temp;
            }

            console.log('Data Array after Sort:', dataArray);

            dataArray.forEach((item) => {
                tableBody.innerHTML += `<tr>
                    <td><img src="${item.picture}" alt="" width="40px"></td>
                    <td class="text-primary">${item.item}</td>
                    <td>${item.price}</td>
                    <td>${item.customerName}</td>
                    <td>${item.customerEmail}</td>
                    <td>${item.date}</td>
                </tr>`;
            });
        } else if (selector.selectedIndex === 1) {
            // Selection sort for sorting by customer email
            for (let i = 0; i < dataArray.length - 1; i++) {
                let minIndex = i;
                for (let j = i + 1; j < dataArray.length; j++) {
                    if (dataArray[j].customerEmail < dataArray[minIndex].customerEmail) {
                        minIndex = j;
                    }
                }
                let temp = dataArray[i];
                dataArray[i] = dataArray[minIndex];
                dataArray[minIndex] = temp;
            }

            console.log('Data Array after Sort:', dataArray);

            dataArray.forEach((item) => {
                tableBody.innerHTML += `<tr>
                    <td><img src="${item.picture}" alt="" width="40px"></td>
                    <td class="text-primary">${item.item}</td>
                    <td>${item.price}</td>
                    <td>${item.customerName}</td>
                    <td>${item.customerEmail}</td>
                    <td>${item.date}</td>
                </tr>`
            })
        } else if (selector.selectedIndex === 2) {
            // Selection sort for sorting by price
            
            for (let i = 0; i < dataArray.length - 1; i++) {
                let minIndex = i;
                for (let j = i + 1; j < dataArray.length; j++) {
                    if (Number(dataArray[j].price) < Number( dataArray[minIndex].price)) {
                        minIndex = j;
                    }
                }
                let temp = dataArray[i];
                dataArray[i] = dataArray[minIndex];
                dataArray[minIndex] = temp;
            }

            console.log('Data Array after Sort:', dataArray);

            dataArray.forEach((item) => {
                tableBody.innerHTML += `<tr>
                    <td><img src="${item.picture}" alt="" width="40px"></td>
                    <td class="text-primary">${item.item}</td>
                    <td>${item.price}</td>
                    <td>${item.customerName}</td>
                    <td>${item.customerEmail}</td>
                    <td>${item.date}</td>
                </tr>`;
            });
        }
    });
};

// Call the getData function when the page loads
getData();

// Add an event listener for the 'change' event
selector.addEventListener('change', getData)
}
}
else {
  console.log('Not available')
  Swal.fire({
    title: "Login First",
    icon: "error",
    background: 'black',
    color: 'red'
  });
  setTimeout(() => {
    window.location.href = './loginAsAdmin.html'

  }, 3000)
  console.log('Not allowed')

}

})
}
 
else if (document.title === 'Update') {
 
  onAuthStateChanged(auth, async(user) => {     //check state admin is login or not
         if (user) {
      const uid = user.uid
      console.log("User ID ", uid)
      console.log('User Email', user.email)
      let adminFound =false
      const querySnapshot = await getDocs(collection(dataBase, "adminSignUp"));

for(let i=0;i<querySnapshot.docs.length;i++){
  if(querySnapshot.docs[i].data().email==user.email){
    adminFound=true
    break
  }
}
if(!adminFound){
    console.log('Not available')
      Swal.fire({
        title: "Not Login As Admin",
        icon: "error",
        background: 'black',
        color: 'red'
      });
      setTimeout(() => {
        window.location.href = './loginAsAdmin.html'
  
      }, 3000)
      console.log('Not allowed')
  
}
 
 else{
  let email = document.getElementById('email');
  let oldPassword = document.getElementById('oldPassword');
  let newPassword = document.getElementById('newPassword');
  let updateButton = document.getElementById('updateButton');
  const auth = getAuth(app);
  const user = auth.currentUser
  

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
      console.log(user.email);
  
      updateButton.addEventListener('click', async () => {
        if (newPassword.value == '' || email.value == '' || oldPassword.value == '') {
          Swal.fire({
            title: "Please fill all the fields",
            icon: "warning",
            background: 'black',
            color: 'yellow'
          });
        } else {
          const credentials = EmailAuthProvider.credential(email.value, oldPassword.value);
          try {
            // Reauthenticate the user
            await reauthenticateWithCredential(user, credentials);
  
            // Update the password
            await updatePassword(user, newPassword.value);
  
            console.log("Password updated successfully");
  
            const querySnapshot = await getDocs(collection(dataBase, "adminSignUp"));
            querySnapshot.forEach((document) => {
              console.log(document.id, " => ", document.data().email, document.data().password);
              if (email.value === `${document.data().email}` && oldPassword.value === `${document.data().password}`) {
                const documentRef = doc(dataBase, "adminSignUp", document.id)
                const updatedData = {
                  email: email.value,
                  password: newPassword.value,
                }
                updateDoc(documentRef, updatedData)
                  .then(() => {
                    console.log("Document updated successfully");
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error);
                  })
  
                console.log('Email found');
                Swal.fire({
                  title: "Password Changed Successfully",
                  icon: "success",
                  background: 'black',
                  color: 'blue'
                });
                // window.location.href='./adminDashBoard.html'
              } else {
                console.log('Sorry');
                Swal.fire({
                  title: "You Entered Invalid Email/Password",
                  icon: "error",
                  background: 'black',
                  color: 'red'
                });
              }
            });
          } catch (error) {
            // Handle reauthentication or password update errors
            console.error("Error updating password:", error.message);
  
            Swal.fire({
              title: "Error updating password",
              text: error.message,
              icon: "error",
              background: 'black',
              color: 'red'
            });
          }
        }
      });
  
    } else {
      console.log("No user is signed in");
    }
  });
}
}

else {
  console.log('Not available')
  Swal.fire({
    title: "Login First",
    icon: "error",
    background: 'black',
    color: 'red'
  });
  setTimeout(() => {
    window.location.href = './loginAsAdmin.html'

  }, 3000)
  console.log('Not allowed')

}

})
}
