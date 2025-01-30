import { app } from './config.js'
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc,onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const auth = getAuth(app);
const dataBase = getFirestore(app);
let mainID
const provider = new GoogleAuthProvider();


if(document.title=='Login As Admin'){
    let loginNav = document.getElementById('navToCustomer')
    let email = document.querySelector('#adminEmail')
    let password = document.querySelector('#adminPassword')
    let submitButton = document.getElementById('submitBtn')
    let eyeIcon = document.getElementById('eyeIcons')
    let openedEye = document.getElementById('openEye')
    let closedEye = document.getElementById('closeEye')
    
    eyeIcon.addEventListener('click', (event) => {      //to show/hide password
        event.preventDefault()
        console.log(password.value)
        if (password.type === 'password') {
            closedEye.style.display = 'none'
            openedEye.style.display = 'block'
            password.type = 'text'
            console.log('Loaded')
        }
        else {
            closedEye.style.display = 'block'
            openedEye.style.display = 'none'
            password.type = 'password'
            console.log('Loaded again')
        }
    })

    loginNav.addEventListener('click', () => {    //to navigate to customer login page
        
        window.location.href = './loginAsCustomer.html'
    })

    

    submitButton.addEventListener('click', () => {

         signInWithEmailAndPassword(auth, email.value, password.value)      //check detail in authentication
        .then(async(userCredential) => {
          let user= userCredential.user
          // console.log(user)
          
          const querySnapshot = await getDocs(collection(dataBase, "adminSignUp"));
          querySnapshot.forEach((doc) => {                      //match data with adminData in dataBase    
            // console.log(doc.id, " => ", doc.data().email);

                 if (email.value === `${doc.data().email}` && password.value === `${doc.data().password}`) {  //all fields filling required
                console.log('Email found');
                              Swal.fire({
                    title: "Welcome",
                    icon: "success",
                    background:'black',
                    color:'blue'
                  })

                window.location.href='./adminDashBoard.html'
            }
            else {
              console.log('Sorry');
              Swal.fire({
                  title: "Not Registered As Admin",
                  icon: "error",
                  background:'black',
                  color:'red'
                });
          }
  
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          title: errorMessage,
          icon: "error",
          background:'black',
          color:'red'
        });
        console.log('Error Message ',errorMessage)
      })                      
              
        
          });
        }
        
         

else if(document.title=='Login As Customer'){

    let loginNav = document.getElementById('navToAdmin')
    let email = document.querySelector('#customerEmail')
    let password = document.querySelector('#customerPassword')
    let submitButton = document.getElementById('submitBtn')
    let eyeIcon = document.getElementById('eyeIcons')
    let openedEye = document.getElementById('openEye')
    let closedEye = document.getElementById('closeEye')
    
    eyeIcon.addEventListener('click', (event) => {      //to hide/show password
        event.preventDefault()
        console.log(password.value)
        if (password.type === 'password') {
            closedEye.style.display = 'none'
            openedEye.style.display = 'block'
            password.type = 'text'
            console.log('Loaded')
        }
        else {
            closedEye.style.display = 'block'
            openedEye.style.display = 'none'
            password.type = 'password'
            console.log('Loaded again')
        }
    })

    loginNav.addEventListener('click', () => {    //navigate to admin login page
        // alert('Login as Admin')
        window.location.href = './loginAsAdmin.html'
    })
    submitButton.addEventListener('click', () => {            
        signInWithEmailAndPassword(auth, email.value, password.value)
  .then(async(userCredential) => {            //check detail in authentication
    // Signed in 
    const user = userCredential.user;
    console.log(user)
    const querySnapshot = await getDocs(collection(dataBase, "customerSignUp"))     //check data of customer in dataBase
        let emailFound = false;   
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            if (email.value === `${doc.data().email}` && password.value === `${doc.data().password}`) {
                // console.log(doc.id)
                mainID=doc.id
                console.log('Email found');
                emailFound = true;
                window.location.href='./customerDashboard.html'
                break;
                 // Exit the loop early if the condition is true
            }
        }
        
        if (!emailFound) {
            console.log('Sorry');
            Swal.fire({
                title: "Not Registered As Customer",
                icon: "error",
                background:'black',
                color:'red'
              });
        }

        console.log('Main ID',mainID)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
console.log(errorMessage)
Swal.fire({
    title: errorMessage,
    icon: "error",
    background:'black',
    color:'red'
  });

  });
        
});         

  const signUpWithGoogle =()=>{       //signUp with google
            console.log('Yes')
            signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user)
        console.log(user.displayName)
        console.log(user.email)
             try {
                const docRef = await addDoc(collection(dataBase, "customerSignUp"), {   //data save in database
                  email: user.email,
                  name:user.displayName,
                  id:user.uid
                })
                console.log("Document written with ID: ", docRef.id);
              } 
              catch (e) {
                console.error("Error adding document: ", e)
              }
    
              window.location.href='./customerDashboard.html'
        }
       
      ).catch((error) => {
        console.log(error)
        const errorMessage = error.message;
        console.log(errorMessage)
        // The email of the user's account used.
        const email = error.customData.email;
        console.log(email)
          });


        // console.log('Thank you')                      
        }        

// let googleIcon = document.querySelector('#googleIcon');
//     googleIcon.addEventListener('click', (event) => {
    
//     // console.log('Welcome')  
//     signUpWithGoogle()
//     })
    

    
}
export {auth}