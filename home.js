
function f1(){
    const button = document.getElementById('toggle-button');
    const cross = document.getElementById('cross-button');
    const nav = document.querySelector('.navlist');
    const active = document.getElementsByClassName('active');
    const navbar = document.querySelector('.navbar');
    button.addEventListener('click' , () =>{
        button.style.display = 'none';
        nav.style.display = 'block';
        cross.style.display = 'block';
        navbar.style.height = "250px";
    });
    cross.addEventListener('click' , () =>{
        nav.style.display = 'none';
        cross.style.display = 'none';
        button.style.display = 'block';
        navbar.style.height = "67px";
    });
}
function close1(){
    document.querySelector('.navbar').click();
}
var preloader = document.getElementById("loading");
// window.addEventListener('load', function(){
// 	preloader.style.display = 'none';
// 	})

function myFunction(){
  setTimeout(() =>{
    preloader.style.display = 'none';
   },2450);
};

// function f2(){
//     const button = document.getElementById('toggle-button');
//     const cross = document.getElementById('cross-button');
//     const nav = document.querySelector('.navlist');
//     cross.addEventListener('click' , () =>{
//         cross.style.display = 'none';
//         nav.classList.toggle('active1');
//         button.style.display = 'block';
//     });
// }