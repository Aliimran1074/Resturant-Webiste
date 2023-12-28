import { app } from './config.js'
import { getAuth, createUserWithEmailAndPassword,updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth(app);
const dataBase = getFirestore(app);

let eyeIcons = document.getElementById('eyeIcons')
let openEye = document.querySelector('#openEye')
let closeEye = document.querySelector('#closeEye')
let customerName = document.querySelector('#customerName')
let customerEmail = document.querySelector('#customerEmail')
let customerPassword = document.querySelector('#customerPassword')

eyeIcons.addEventListener('click', (event) => {     //to show/hide password
    event.preventDefault()
    console.log(customerPassword.value)
    if (customerPassword.type === 'password') {
        openEye.style.display = 'none'
        closeEye.style.display = 'block'
        customerPassword.type = 'number'
    }
    else {
        openEye.style.display = 'block'
        closeEye.style.display = 'none'
        customerPassword.type = 'password'
    }
})



let submitButton = document.getElementById('submitBtn')  
submitButton.addEventListener('click', () => {
    if (customerName.value == '' || customerEmail.value == '' || customerPassword == '')  {         //all field should field
        Swal.fire({
            icon: "warning",
            title: "Please fill all the required Fill ",
            background: 'black',
            color: 'yellow'
        });
    }
    else {
        
        createUserWithEmailAndPassword(auth, customerEmail.value, customerPassword.value)   //creating user in authentication
        .then(async (data) => {
            const user = data.user;
            const userId = user.uid;
            // Set the displayName property
            await updateProfile(user, {
                displayName: customerName.value
            });
    
            console.log("Authentication ID", userId);
            console.log(user);
    
            try {
                
                const docRef = await addDoc(collection(dataBase, `customerSignUp`), {       //adding data of customer in firestore
                    email: customerEmail.value,
                    password: customerPassword.value,
                    name: user.displayName,
                    id: userId
                });
    
                let fireId = docRef.id;
                // console.log("Document written with ID: ", fireId);
                window.location.href = './loginAsCustomer.html';
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        })
        .catch((error) => {
            // Handle error
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            Swal.fire({
                icon: "error",
                title: errorMessage,
                background: 'black',
                color: 'red'
            });
        });
    
    
}
    })
























