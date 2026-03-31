// ====== HAMBURGER ======
const toggle =
document.getElementById("menu-toggle");
const nav =
document.getElementById("nav-menu");

if(toggle){
    toggle.addEventListener('click',()=>{nav.style.display = nav.style.display === "flex" ? "none" : "flex"});
}

// ====== SLIDER ======
let slides =
document.querySelectorAll(".slide");
let current = 0;

function nextSlide(){
    if(slides.length > 0){
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active")
    }
}

setInterval(nextSlide,7000);

// ====== LOADER ======
window.addEventListener("load",()=> {const loader = document.querySelector(".loader");
if(loader){
    loader.style.display = "none";
}
})

// ====== SCROLL ANIMATION ======
const sections =
document.querySelectorAll(".glass-section");

window.addEventListener("scroll",()=>{sections.forEach(section=>{
    const sectionTop =
    section.getBoundingClientRect().top;
    if(sectionTop < window.innerHeight -  100){
        section.classList.add("show");
    }
})
})

// ====== PRELOADER ====== //
window.addEventListener("load", function () {

    const loader = document.getElementById("preloader");
    const content = loader.querySelector(".loader-content");

    setTimeout(() => {
        content.classList.add("splash");
        content.style.animation = "splash 1.5s forwards";
    }, 10000);

    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 21500);
});

// ====== CONTROL TIMING FOR DOTS ====== //
window.addEventListener("load", () => {
    const preloader =
document.getElementById("preloader");
    const dots =
document.querySelector(".dots")

setTimeout(() => {
    dots.classList.add("show");
}, 10000);

setTimeout(() => {
    preloader.style.opacity = "0";

    setTimeout(() => {
        preloader.style.display = "none";
    },500);
}, 21500);
});



// ====== WORK ====== //
const galleryImages =
document.querySelectorAll(".portfolio-item img");
const modal =
document.getElementById("imageModal");
const modalImg =
document.getElementById("modalImage");

const next =
document.querySelector(".next");
const prev =
document.querySelector(".prev");
const close =
document.querySelector(".close");

let currentIndex = 0;

galleryImages.forEach((img,index)=>{
    img.addEventListener("click",()=>{
        modal.style.display="block";
        modalImg.src = img.src;
        currentIndex = index;
    });
});


close.onclick = function () {
    modal.style.display="none";
};

next.onclick = ()=>{
    currentIndex++;
    if(currentIndex >= galleryImages.length)
    {
        currentIndex = 0;
    }

    modalImg.src =
    galleryImages[currentIndex].src;
};

prev.onclick = ()=>{
    currentIndex--;
    if(currentIndex < 0){
        currentIndex = galleryImages.length - 1;
    }

    modalImg.src =
    galleryImages[currentIndex].src;
};

let zoomLevel = 1;

modalImg.addEventListener("wheel", function(e){
    e.preventDefault();

    if(e.deltaY < 0){
        zoomLevel += 0.1;
    }else{
        zoomLevel -= 0.1;
    }

    if(zoomLevel < 1){
        zoomLevel = 1;
    }

    if(zoomLevel > 3){
        zoomLevel = 3;
    }

    modalImg.style.transform = "scale(" + zoomLevel + ")";
});

function resetZoom(){
    zoomLevel = 1;
    modalImg.style.transform = "scale(1)";
}

next.addEventListener("click", resetZoom);
prev.addEventListener("click", resetZoom);
close.addEventListener("click", resetZoom);
 
// ====== ABOUT ====== //
const elements =
document.querySelector(
    ".about-title, .about-intro, .about-card"
);
const observer = new
IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

elements.forEach(el =>
observer.unobserve(el));



