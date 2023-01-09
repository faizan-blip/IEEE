
function f1(){
    const button = document.getElementById('toggle-button');
    const cross = document.getElementById('cross-button');
    const nav = document.querySelector('.navlist');
    const flex = document.querySelector('.flex');
    const navbar = document.querySelector('.navbar');
    const news = document.getElementById('breaking-news-container');
    button.addEventListener('click' , () =>{
        button.style.display = 'none';
        nav.style.setTimeout = '2s'
        nav.style.display = 'block';
        cross.style.display = 'block';
        navbar.style.height = "340px";
        news.style.top = "340px";
      //   flex.style.display="block";
    });
    cross.addEventListener('click' , () =>{
        nav.style.display = 'none';
        cross.style.display = 'none';
        button.style.display = 'block';
        navbar.style.height = "67px";
        news.style.top = "65px";
      //   flex.style.display="none";
    });
}
// function close1(){
//     document.getElementById('cross-button').click();
// }
 function close1(){
    const navbar = document.querySelector('.navbar');
    const nav = document.querySelector('.navlist');
    const button = document.getElementById('toggle-button');
     const cross = document.getElementById('cross-button');
     const title = document.getElementById('title');
     const news = document.getElementById('breaking-news-container');
     const x = window.matchMedia("(max-width: 767px)");
     if(x.matches){    
    navbar.style.height = "67px";
    nav.style.display = 'none';
    button.style.display = 'block';
    cross.style.display = 'none';
    news.style.top = "65px";
     }
     else{
        navbar.style.opacity = '0.4';
        navbar.style.opacity = '1';
     }
 }
 function expand(){
    const col = document.getElementById('col');
    const  ach = document.getElementById('ach');
    const  ret = document.getElementById('ret');
    const  read = document.getElementById('read');
    col.style.display = "block";
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "center";
    read.style.display = "none";
    ach.style.display = "block";
    ach.style.display = "flex";
    ach.style.flexDirection = "column";
    ach.style.alignItems = "center";
    ret.style.display = "block";
 }
 function expand1(){
    const col = document.getElementById('col');
    const  ach = document.getElementById('ach');
    const  ret = document.getElementById('ret');
    const  read = document.getElementById('read');
    ret.style.display = "none";
    read.style.display = "block";
    col.style.display = "none";
    ach.style.display = "none";
    
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