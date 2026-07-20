

import { initCustomCursor } from "./cursor.js";
// ...
initCustomCursor();

window.addEventListener("load",()=>{


    const loader =
    document.getElementById("loader");



    gsap.to(
        loader,
        {

            opacity:0,

            duration:1.2,

            delay:1,

            ease:"power3.out",


            onComplete:()=>{

                loader.style.display="none";

            }

        }
    );



});







// ================================
// HERO INTRO
// ================================



const heroTimeline = gsap.timeline();



heroTimeline.from(

    ".logo",

    {

        y:-50,

        opacity:0,

        duration:1,

        ease:"power3.out"

    }


);



heroTimeline.from(

    ".hero-text .small",

    {

        opacity:0,

        y:30,

        duration:1

    }


);



heroTimeline.from(

    ".hero-text h1",

    {

        opacity:0,

        scale:.8,

        duration:1.4,

        ease:"expo.out"

    }


);




heroTimeline.from(

    ".tagline",

    {

        opacity:0,

        y:30,

        duration:1

    }


);




heroTimeline.from(

    ".enter",

    {

        opacity:0,

        y:30,

        duration:1

    }


);









// ================================
// CURSOR
// ================================


const cursor =
document.createElement("div");


cursor.className =
"cursor";



document.body.appendChild(cursor);




let mouse = {

    x:0,

    y:0

};



window.addEventListener(

"mousemove",

(e)=>{


mouse.x =
e.clientX;


mouse.y =
e.clientY;



cursor.style.left =
mouse.x+"px";


cursor.style.top =
mouse.y+"px";



}

);





document.querySelectorAll("a")
.forEach(link=>{


link.addEventListener(

"mouseenter",

()=>{


cursor.classList.add("active");


}

);



link.addEventListener(

"mouseleave",

()=>{


cursor.classList.remove("active");


}

);



});







// ================================
// SMOOTH BUTTON EFFECT
// ================================


document.querySelectorAll(".enter")
.forEach(button=>{


button.addEventListener(

"mouseenter",

()=>{


gsap.to(

button,

{

scale:1.08,

duration:.3

}

);


}

);



button.addEventListener(

"mouseleave",

()=>{


gsap.to(

button,

{

scale:1,

duration:.3

}

);


}

);



});