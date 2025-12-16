
(function(){
  const slider = document.getElementById('slider');
  if(!slider) return;

  const slides = Array.from(slider.getElementsByClassName('slide'));
  const dotsContainer = document.getElementById('dots');
  const total = slides.length;
  const points = 3;

  for(let i=0;i<points;i++){
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click',()=>snapToPoint(i));
    dotsContainer.appendChild(dot);
  }

  function updateDots(){
    const slideWidth = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;
    const step = (slideWidth + gap) * (total / points);
    const index = Math.round(slider.scrollLeft / step);

    document.querySelectorAll('#dots .dot')
      .forEach((d,i)=>d.classList.toggle('active', i === index));
  }

  function snapToPoint(i){
    const slideWidth = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;
    const step = (slideWidth + gap) * (total / points);
    slider.scrollTo({ left:i*step, behavior:'smooth' });
    setTimeout(updateDots,300);
  }

  snapToPoint(0);

  let isDown=false,startX,scrollLeft;
  slider.addEventListener('pointerdown',e=>{
    isDown=true;
    startX=e.clientX;
    scrollLeft=slider.scrollLeft;
  });
  slider.addEventListener('pointermove',e=>{
    if(!isDown) return;
    slider.scrollLeft = scrollLeft + (startX - e.clientX);
    updateDots();
  });
  ['pointerup','pointerleave','pointercancel']
    .forEach(ev=>slider.addEventListener(ev,()=>isDown=false));

  slider.addEventListener('scroll',()=>requestAnimationFrame(updateDots));
})();


function filterProducts(targetType){
  const cards = document.querySelectorAll("#product_section .product-card");

  cards.forEach(card=>{
    const type = card.dataset.type;
    if(targetType === 'all' || type === targetType){
      card.classList.remove('hidden-by-filter');
    } else {
      card.classList.add('hidden-by-filter');
    }
  });

  document.getElementById('product_section')
    ?.scrollIntoView({behavior:'smooth',block:'center'});
}

const aboutImages = document.querySelectorAll('.image-side img');
let aboutIndex = 0;

if(aboutImages.length){
  setInterval(()=>{
    aboutImages[aboutIndex].classList.remove('active');
    aboutIndex = (aboutIndex + 1) % aboutImages.length;
    aboutImages[aboutIndex].classList.add('active');
  },3000);
}



const sliderTrack = document.getElementById("sliderTrack");
const sliderContainer = document.getElementById("sliderContainer");
const cards = document.querySelectorAll(".card");
const dotsContainer = document.getElementById("dotsContainer");

let currentIndex = 0;


function getCardsPerPage() {
    if(window.innerWidth <= 576) return 1;
    if(window.innerWidth <= 992) return 2;
    return 3;
}

function createDots() {
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(cards.length / getCardsPerPage());
    for(let i=0; i<pages; i++){
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if(i===0) dot.classList.add('active');
        dot.addEventListener('click', ()=> moveSlider(i));
        dotsContainer.appendChild(dot);
    }
}
createDots();


function moveSlider(index){
    const cardsPerPage = getCardsPerPage();
    const pageWidth = sliderContainer.clientWidth;
    sliderTrack.style.transform = `translateX(-${pageWidth * index}px)`;
    currentIndex = index;

    
    const dots = document.querySelectorAll('.dot');
    dots.forEach(d=> d.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}


setInterval(()=>{
    const pages = Math.ceil(cards.length / getCardsPerPage());
    currentIndex = (currentIndex + 1) % pages;
    moveSlider(currentIndex);
}, 4000);


window.addEventListener('resize', ()=>{
    createDots();
    moveSlider(0);
});
