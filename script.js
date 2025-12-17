
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




document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector("#testimonials");
    if (!section) return;

    let index = 0;

    const track = section.querySelector("#sliderTrack");
    const cards = section.querySelectorAll(".card");
    const dotsContainer = section.querySelector("#dotsContainer");

    function cardsPerView() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function updateSlider() {
        if (!cards.length) return;
        const cardWidth = cards[0].offsetWidth;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    function createDots() {
        dotsContainer.innerHTML = "";

        const totalDots = cards.length - cardsPerView() + 1;

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement("span");
            if (i === index) dot.classList.add("active");

            dot.addEventListener("click", () => {
                index = i;
                updateSlider();
                setActiveDot();
            });

            dotsContainer.appendChild(dot);
        }
    }

    function setActiveDot() {
        const dots = dotsContainer.querySelectorAll("span");
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[index]) dots[index].classList.add("active");
    }

    function autoSlide() {
        const maxIndex = cards.length - cardsPerView();
        index = (index >= maxIndex) ? 0 : index + 1;
        updateSlider();
        setActiveDot();
    }

    createDots();
    updateSlider();

    setInterval(autoSlide, 4000);

    window.addEventListener("resize", () => {
        index = 0;
        updateSlider();
        createDots();
    });

});


let users = JSON.parse(localStorage.getItem("users")) || [];
let editIndex = null;

const form = document.getElementById("crudForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const searchInput = document.getElementById("search");
const userList = document.getElementById("userList");

renderUsers();

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
    };

    if (editIndex === null) {
        users.push(user);
    } else {
        users[editIndex] = user;
        editIndex = null;
    }

    form.reset();
    save();
    renderUsers();
});

searchInput.addEventListener("input", renderUsers);

function renderUsers() {
    userList.innerHTML = "";
    const filter = searchInput.value.toLowerCase();

    users.forEach((u, i) => {
        if (
            !u.name.toLowerCase().includes(filter) &&
            !u.email.toLowerCase().includes(filter) &&
            !u.message.toLowerCase().includes(filter)
        ) return;

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>${u.name}</strong><br>
                ${u.email}<br>
                <small>${u.message}</small>
            </div>
            <div class="actions">
                <button class="edit" onclick="editUser(${i})">Edit</button>
                <button class="delete" onclick="deleteUser(${i})">Delete</button>
            </div>
        `;

        userList.appendChild(li);
    });
}

function editUser(i) {
    nameInput.value = users[i].name;
    emailInput.value = users[i].email;
    messageInput.value = users[i].message;
    editIndex = i;
}

function deleteUser(i) {
    users.splice(i, 1);
    save();
    renderUsers();
}

function save() {
    localStorage.setItem("users", JSON.stringify(users));
}
