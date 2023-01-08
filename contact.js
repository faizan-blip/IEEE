const firebaseConfig = {
    apiKey: "AIzaSyDvCwQODqMPt_tF-rA2AwAbzGFnXmEY8kc",
    authDomain: "contact-us-form-4fb07.firebaseapp.com",
    databaseURL: "https://contact-us-form-4fb07-default-rtdb.firebaseio.com",
    projectId: "contact-us-form-4fb07",
    storageBucket: "contact-us-form-4fb07.appspot.com",
    messagingSenderId: "856854418047",
    appId: "1:856854418047:web:b503bbcde0ea64b9ae654a"
  };
//initialise
  firebase.initializeApp(firebaseConfig);
//refer
var ContactformDB = firebase.database().ref('Contactform');

document.getElementById('Contactform').addEventListener('submit' , submitForm);
   
function submitForm(e){

    e.preventDefault();

    var name1 = document.getElementById('name1').value;
    var name2 = document.getElementById('name2').value;
    var email = document.getElementById('email').value;
    var msg = document.getElementById('msg').value;

    // console.log(name1,name2,email,msg);

    saveMessages(name1,name2,email,msg); 
   
    const alert = document.querySelector('.alert');
     alert.style.display = 'block'; 

     setTimeout(() => {
        alert.style.display = 'none';
     },2000);
     
     document.getElementById('Contactform').reset();
}

const saveMessages = (name1,name2,email,msg) =>{
      
      var newContactform = ContactformDB.push();
      
      newContactform.set({
        name1 : name1,
        name2 : name2,
        email : email,
        msg : msg,
      });
};
