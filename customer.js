import { app } from "./config.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, onSnapshot, deleteDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"

const dataBase = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)
const user = auth.currentUser;

if (document.title == 'Customer Dashboard') {
    // signOut(auth)            //logout work remaining
    // .then(() => {
    //   // Sign-out successful.
    //   console.log('User signed out');
    //   // You may want to redirect to a different page or perform other actions after logout.
    // })
    // .catch((error) => {
    //   // An error happened.
    //   console.error('Error during sign out:', error.message);
    // });



    onAuthStateChanged(auth, async (user) => {              //check the user is customer or not
        if (user) {
            // console.log(user);
            const uid = user.uid;
            console.log(user.email);
            console.log(user.displayName);
            let customerFound=false
            const querySnapshot = await getDocs(collection(dataBase, "customerSignUp"));

            for(let i=0;i<querySnapshot.docs.length;i++){
              if(querySnapshot.docs[i].data().email==user.email){
                customerFound=true
                break
              }
            }
            if(!customerFound){
                console.log('Not available')
                  Swal.fire({
                    title: "Not Login As Customer",
                    icon: "error",
                    background: 'black',
                    color: 'red'
                  });
                  setTimeout(() => {
                    window.location.href = './loginAsCustomer.html'
              
                  }, 3000)
                  console.log('Not allowed')
              
            }else{
    let selector = document.getElementById('selector');
    let count = 0;
    
    let img = document.getElementById('image')    //image changing
    let imageUrls = [
        'https://www.shutterstock.com/image-photo/dum-handi-chicken-biryani-prepared-600nw-2000023562.jpg',
        'https://t4.ftcdn.net/jpg/05/67/61/35/360_F_567613541_rABRpKAjdD3Hyo3e3ebVEx7VHBiF5kHI.jpg',
        'https://hamariweb.com/recipes/images/recipeimages/3328.jpg'
    ];
    let currentIndex = 0;

    setInterval(() => {
        img.src = imageUrls[currentIndex];
        currentIndex = (currentIndex + 1) % imageUrls.length
    }, 4000);

                // console.log(uid);

            let rowDiv = document.getElementById('divRow');
            let searchField = document.getElementById('searchField')
            let searchIcon = document.getElementById('searchIcon')
            let dataArray = []  //empty array


            let getData = () => {     //asynchronous    
                return new Promise((resolve)=>{
               console.log('function start')
                
                onSnapshot(collection(dataBase, "data"), async (data) => {
                  console.log('on snapShot start')
                    // dataArray = [] //(on uncommenting given only new element)
                    // console.log(data)
                    data.docChanges().forEach((newData) => {
                        let docId = newData.doc.id
                        
                        if (newData.type === 'added') {
                            dataArray.push(newData.doc);      //[] =>Biryani =>['Biryani']
                        }
                        else if (newData.type === 'modified') {
                            window.location.reload()
                        }
                        else if (newData.type === 'removed') {
                            window.location.reload()
                        }
                    })
                    resolve ({ dataArray })             //retrun array with data
                })   
            })
            }

            async function fetchAndRender(){        
            let newData =await getData()   
            // console.log(newData)

             function dataSorting(){
                let newArray=  newData.dataArray
                // console.log(newArray.length)
             
                const renderHtml = () => {        //to render data in document
                    rowDiv.innerHTML = ''
                    for (let i = 0; i < newArray.length; i++) {
                        rowDiv.innerHTML += `<div class="col-md-4 mt-4" id="${newArray[i].id}">
    <div class="card" style="width: 18rem;">
    <img src="${newArray[i].data().imageUrl}" class="card-img-top" width='100px' height='200px' alt="abc">
    <div class="card-body">
        <h5 class="card-title">${newArray[i].data().itemName}</h5>
        <h3 class="card-title">Price: <span class="card-price">${newArray[i].data().itemPrice}</span></h3>
        <p class="card-text">${newArray[i].data().itemDiscription}.</p>
        <button class="btn btn-lg btn-outline-primary" onclick="addToCart(this,'${newArray[i].id}')">Add to Cart</button>
    </div>
    </div>
    </div>`
                    }
                }
 //bubble sort                
                if (selector.selectedIndex == 2) {
                                for (let i = 0; i < newArray.length; i++) {
                                    for (let j = 0; j < newArray.length - i - 1; j++) {
                                        if (Number(newArray[j].data().itemPrice) > Number(newArray[j + 1].data().itemPrice)) {
                                            [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]]  //swapping

                                        }
                                    }
                                }
                                // console.log('MIn to Max')
                        }
                            else if (selector.selectedIndex == 1) {
                                for (let i = 0; i < newArray.length; i++) {
                                    for (let j = 0; j < newArray.length - i - 1; j++) {
                                        if (Number(newArray[j].data().itemPrice) < Number(newArray[j + 1].data().itemPrice)) {
                                            [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
                                        }
                                    }
                                    // console.log('Max to Min')
                                }
                            }
                            renderHtml()
                                                   }

                        dataSorting()
                       selector.addEventListener('change',()=>{
                           dataSorting()   //calling
                       })

            function searching(){
                let ArrayforSearch=  newData.dataArray
                     
            for(let i=0;i<ArrayforSearch.length;i++){
                // console.log(ArrayforSearch[i].data())
            } 
            
            searchIcon.addEventListener('click', (event) => {
                event.preventDefault()
                let searchIndexFound = 0   //no element found
                let customerSearchArray = []  //will push data of customer search here
                    let customerSearchFirstLetter = searchField.value[0].toUpperCase()   
                    let customerSearchNextLetters = searchField.value.slice(1).toLowerCase() 
                    let finalCustomerValue = customerSearchFirstLetter + customerSearchNextLetters  
                    let lowerCaseValue =finalCustomerValue.toLowerCase()   
                    let upperCaseValue=finalCustomerValue.toUpperCase()  
                    console.log(upperCaseValue)
                //  })

                    for (let i = 0; i < ArrayforSearch.length; i++) {
                        if (ArrayforSearch[i].data().itemName.includes(finalCustomerValue) ||
                        ArrayforSearch[i].data().itemName.includes(lowerCaseValue) ||
                        ArrayforSearch[i].data().itemName.includes(upperCaseValue)) {
                            console.log(ArrayforSearch[i].data().itemPrice)
                            console.log(i)
                            customerSearchArray.push(ArrayforSearch[i])
                            searchIndexFound++
                        }
                    }
         if (searchIndexFound > 0) {
                        // console.log('No of elements found', searchIndexFound)
                        for(let i=0;i<customerSearchArray.length;i++){
                        console.log("Search Element Name",customerSearchArray[i].data().itemName)    
                        }
                    
                                 rowDiv.innerHTML = ''
                        for (let i = 0; i < customerSearchArray.length; i++) {
                            rowDiv.innerHTML += `<div class="col-md-4 mt-4" id="${customerSearchArray[i].id}">
                <div class="card" style="width: 18rem;">
                    <img src="${customerSearchArray[i].data().imageUrl}" class="card-img-top" width='100px' height='200px' alt="abc">
                    <div class="card-body">
                        <h5 class="card-title">${customerSearchArray[i].data().itemName}</h5>
                        <h3 class="card-title">Price: <span class="card-price">${customerSearchArray[i].data().itemPrice}</span></h3>
                        <p class="card-text">${customerSearchArray[i].data().itemDiscription}.</p>
                        <button class="btn btn-lg btn-outline-primary" onclick="addToCart(this,'${customerSearchArray[i].id}')">Add to Cart</button>
                    </div>
                </div>
            </div>`
                        }
                    }
                    else {
                                    rowDiv.innerHTML = ''
                                    rowDiv.innerHTML = `<br><br><br><br><h3 style="color:gray" class="container mt-4 ml-4"> No item Available of name ${finalCustomerValue} <h3>`
                                    console.log('not found')
                                }
                                searchField.value = ''                            

        })                                 
           
        }
            searching()
            }

            fetchAndRender()
         
            let addToCart = (e, id) => {
                count++
                let titleElement = e.parentNode.querySelector('.card-title')            //e.parent=<div class="cardBody">
                let titleText = titleElement.innerText

                let priceElement = e.parentNode.querySelector('.card-price')
                let priceText = priceElement.innerText

                let imgElement = document.getElementById(id)                //->getting row Div
                let imgSrc = imgElement.querySelector('.card-img-top').src

                let existingItems = JSON.parse(sessionStorage.getItem('CartItems')) || []       //getExisting item(from sessin storage) if not then will make an empty array

                let newItem = {
                    itemName: titleText,
                    itemPrice: priceText,
                    itemPic: imgSrc,
                    count: count
                };
                existingItems.push(newItem)         //pushing item in array

                sessionStorage.setItem('CartItems', JSON.stringify(existingItems))      //convert into string

// Here using JSON stringify and parse to avoid dataOverridding in session storage

                let countHtml = document.getElementById('count')
                countHtml.innerHTML = count
                Swal.fire({
                    title: "Item Added To Card Successfully",
                    icon: "success",
                    background: 'black',
                    color: 'success'
                });
                console.log('Item added successfully to Storage');
            };


            window.getData = getData;
            window.addToCart = addToCart;
        } 
    }
        else {
            Swal.fire({
                title: "User not login",
                icon: "error",
                background: 'black',
                color: 'red'
            });
            setTimeout(() => {
                window.location.href = './loginAsCustomer.html';
            }, 3000);
            console.log('Not allowed');
        }
    })

}


else if (document.title == 'Cart') {
    // console.log(mainID)
    let uniqueId
    let customerEmail
    let customerName
    onAuthStateChanged(auth,async (user) => {
        if (user) {
            console.log(user)
            uniqueId = user.uid;
            customerEmail = user.email
            customerName = user.displayName
            console.log('Customer Email :', customerEmail)
            console.log('Customer Name :', customerName)
            console.log(uniqueId)
            let customerFound=false
            const querySnapshot = await getDocs(collection(dataBase, "customerSignUp"));

            for(let i=0;i<querySnapshot.docs.length;i++){
              if(querySnapshot.docs[i].data().email==user.email){
                customerFound=true
                break
              }
            }
            if(!customerFound){
                console.log('Not available')
                  Swal.fire({
                    title: "Not Login As Customer",
                    icon: "error",
                    background: 'black',
                    color: 'red'
                  });
                  setTimeout(() => {
                    window.location.href = './loginAsCustomer.html'
              
                  }, 3000)
                  console.log('Not allowed')
              
            }
else{
    let tableBody = document.querySelector('#tableBody');
    // let cartCount = document.getElementById('cartCount')
    tableBody.innerHTML = ''
    let checkOut = document.getElementById('checkOut')
    
    
    let cartItems = sessionStorage.getItem('CartItems');
    let cartItemsObj = JSON.parse(cartItems) || [];

    function removeItem(index) {
        // Remove the item from the array
        cartItemsObj[index].count--
        cartItemsObj.splice(index, 1);
        // Update sessionStorage with the modified array
        sessionStorage.setItem('CartItems', JSON.stringify(cartItemsObj));

        Swal.fire({
            title: "Item Removed",
            icon: "success",
            background: 'black',
            color: 'warning'
        });
        // Remove the corresponding row from the table
        renderTable();
    }

    // Function to render the table based on the current items in sessionStorage
    function renderTable() {

        tableBody.innerHTML = '';
        // let totalCount = 0;

        for (let i = 0; i < cartItemsObj.length; i++) {
            // totalCount += cartItemsObj[i].count;

            tableBody.innerHTML +=
                `<tr>
            <td><img src="${cartItemsObj[i].itemPic}" alt="" width="40px"></td>
            <td>${cartItemsObj[i].itemName}</td>
            <td>${cartItemsObj[i].itemPrice}</td>
            <td><button class="btn btn-sm btn-danger" onclick="removeItem(${i})">Delete</button></td>
            </tr>`;
        }

        // Update the total count displayed on the page
        // cartCount.innerHTML = totalCount;
    }
    renderTable();

    if (tableBody.innerHTML !== '') {
        checkOut.style.display = 'block'
    }


    async function addItem() {
        console.log(cartItemsObj)

        for (let i = 0; i < cartItemsObj.length; i++) {
            try {
            //     const docRef = await addDoc(collection(dataBase, `customerOrder/orderPlacement/${uniqueId}`), {
            //         customerEmail: customerEmail,
            //         customerName: customerName,
            //         date: new Date().toLocaleString(),
            //         item: cartItemsObj[i].itemName,
            //         price: cartItemsObj[i].itemPrice,
            //         picture: cartItemsObj[i].itemPic
            //     });
            //     console.log("Stored in customer Data with ID: ", docRef.id);

                const docRef1 = await addDoc(collection(dataBase, `order`), {           //add data in dataBase with name of customer and email
                    customerEmail: customerEmail,
                    customerName: customerName,
                    date: new Date().toLocaleString(),
                    item: cartItemsObj[i].itemName,
                    price: cartItemsObj[i].itemPrice,
                    picture: cartItemsObj[i].itemPic
                })
                console.log('Stored in order placement data with id :', docRef1.id)

            } catch (e) {
                console.error("Error adding document: ", e);
                console.log(e.message)
            }
        }
    }
    checkOut.addEventListener('click', () => {
        addItem()
        sessionStorage.removeItem('CartItems')          //remove data from session storage
        tableBody.innerHTML = ''
        // cartCount.innerHTML = 0
        // console.log('Item Removed Successfully')
        Swal.fire({
            title: "Check Out Successfully",
            icon: "success",
            background: 'black',
            color: 'success'
        });
    })

    window.removeItem = removeItem
}
}
else{
    Swal.fire({
        title: "User not login",
        icon: "error",
        background: 'black',
        color: 'red'
    });
    setTimeout(() => {
        window.location.href = './loginAsCustomer.html';
    }, 3000);
    console.log('Not allowed');    
}
})

}

