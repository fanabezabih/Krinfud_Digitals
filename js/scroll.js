/* ==========================================
   KRINFUD DIGITALS
   SCROLL ANIMATIONS
========================================== */



gsap.registerPlugin(ScrollTrigger);





// ===============================
// HERO SCROLL EFFECT
// ===============================



gsap.to(

    ".hero-text",

    {

        opacity:0,

        y:-150,

        scrollTrigger:{

            trigger:"#hero",

            start:"top top",

            end:"bottom top",

            scrub:true

        }


    }

);







// ===============================
// THREE CONTAINER MOVEMENT
// ===============================



gsap.to(

    "#three-container",

    {


        scale:1.4,


        opacity:0,


        scrollTrigger:{


            trigger:"#hero",


            start:"center top",


            end:"bottom top",


            scrub:true


        }


    }

);








// ===============================
// WORLDS TITLE
// ===============================



gsap.from(

    ".title",

    {


        opacity:0,


        y:100,


        scrollTrigger:{


            trigger:"#worlds",


            start:"top 80%",


            end:"top 40%",


            scrub:true


        }


    }

);







// ===============================
// WORLD CARDS
// ===============================



gsap.from(

    ".world",

    {


        opacity:0,


        y:120,


        stagger:.2,


        scrollTrigger:{


            trigger:".world-container",


            start:"top 80%",


        }


    }

);







// ===============================
// PLANET FLOATING
// ===============================



gsap.to(

    ".planet",

    {


        y:-20,


        repeat:-1,


        yoyo:true,


        duration:2,


        ease:"sine.inOut"



    }

);