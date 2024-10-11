const petsContainer=document.getElementById('pet-container');
let allPets = [];

// Spinner
// Function to show spinner
const showSpinner = () => {
  document.getElementById('spinner').classList.remove('hidden');
  document.getElementById('pet-container').classList.add('hidden');
  console.log('spinner')
};

// Function to hide spinner
const hideSpinner = () => {
  document.getElementById('spinner').classList.add('hidden');
  document.getElementById('pet-container').classList.remove('hidden');
};

// Fetching pet category
const fetchCategory=()=>{
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
    .then(res => res.json())
    .then(data => {
      displayCategories(data.categories)
})
}

const displayCategories=(data)=>{
    const categoryContainer=document.getElementById('category-container')
    for(const val of data){
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
      <button id="btn-${val.category}" onclick='loadSpecific("${val.category}")' class="btn category-btn px-8 lg:px-12">
       <img class="h-8 w-8" src="${val.category_icon}" alt="" srcset="">
       ${val.category}
      </button>
    `;

    //add button to category container
    categoryContainer.append(buttonContainer);
    }
}

// Load specific pet
const loadSpecific=(name)=>{
  showSpinner();
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${name}`)
    .then(res => res.json())
    .then(data => {
      allPets=data.data;
    removeActiveClass();
    //id er class k active korao
    const activeBtn = document.getElementById(`btn-${name}`);
    activeBtn.classList.add("active");
    console.log(data.data)
    setTimeout(() => {
      displayPets(data.data);
      hideSpinner(); // Hide spinner after data is displayed
  }, 2000); 
    })
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    for (let btn of buttons) {
      btn.classList.remove("active");
    }
};

// Fetch all pets
const loadPets=()=>{
  showSpinner();
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
    .then(res => res.json())
    .then(data => {
      allPets=data.pets;
      setTimeout(() => {
        displayPets(data.pets);
        hideSpinner(); // Hide spinner after pets are displayed
    }, 2000); 
    })
}


const displayPets=(pets)=>{
    const petsContainer=document.getElementById('pet-container')
    petsContainer.innerHTML="";
    if(pets.length==0){
      petsContainer.classList.remove("grid");
      petsContainer.innerHTML = `
   <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
    <img src="./images/error.webp" alt="" srcset="">
    <h2 class="text-center text-2xl font-bold"> No Information Available</h2> 
    <p class=" text-gray-400 text-center">No information available at the moment. It seems that there are no pets currently listed under this category. Please check back later or explore other categories to find your perfect companion!</p>
   </div>`;
  } else {
  petsContainer.classList.add("grid");
  }
    for(const pet of pets){
    console.log(pet)
    const card=document.createElement('div');
    card.classList="card border border-1 border-gray-300";
    card.innerHTML=
    `
    <figure class="px-3 pt-5">
    <img
      src=${pet.image}
      alt="Shoes"
      class="rounded-xl" />
  </figure>
   <div class="card-body px-3 py-2 ">
    <h2 class="text-xl font-bold text-txt">${pet.pet_name}</h2>
    <span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=32&id=14970&format=png" alt="" srcset=""> 
    Breed: ${pet.breed ? pet.breed : "Not available"}</span>
    <span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=24&id=4p2G9EBQbqA4&format=png" alt="" srcset=""> 
    Birth: ${pet.date_of_birth ? pet.date_of_birth : "Not available"}</span>
    <span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=24&id=19766&format=png" alt="" srcset=""> 
       Gender: ${pet.gender ? pet.gender : "Not available"}</span>
    <span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=24&id=85107&format=png" alt="" srcset=""> 
       Price: ${pet.price ? pet.price : "Not mentioned"}</span>
    <div class="card-actions border-t flex  gap-1 md:gap-3">
      <button id="like-${pet.petId}" onclick="loadPic(${pet.petId})" class="border border-1 border-gray-300 rounded-lg mt-2 px-4 py-2"><img class="h-5 w-5" src="https://img.icons8.com/?size=24&id=88589&format=png" alt="" srcset=""></button>
      <button id="adopt-${pet.petId}" onclick="loadCounter(${pet.petId})"  class="border border-1 border-gray-300 rounded-lg mt-2 px-4 py-2 text-[#0E7A81] font-bold">Adopt</button>
      <button onclick="loadDetails('${pet.petId}')" class="border border-1 border-gray-300 rounded-lg mt-2 text-[#0E7A81] px-4 py-2 font-bold">Details</button>
    </div>
  </div>
    `
    petsContainer.append(card);
    }
}

// Function to sort pets by price (descending order)
const sortPetsByPrice = () => {
  const sortedPets = allPets.sort((a, b) => b.price - a.price); // Sort by price descending
  displayPets(sortedPets); // Re-render pets with sorted order
}

// Event listener for "Sort by Price" button
document.getElementById('sort-price').addEventListener('click', sortPetsByPrice);

// Load Pet Pic
const loadPic=(id)=>{
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
    .then(res => res.json())
    .then(data => {
    const likeContainer=document.getElementById('like-container');
    const likePic=document.createElement('div')
    likePic.innerHTML=
    `
    <img class=" p-2" src=${data.petData.image} alt=""  srcset="">
    `
    likeContainer.append(likePic)
    })
}

//Load Details
const loadDetails = async (petId) => {
  console.log(petId);
  const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
  const res = await fetch(uri);
  const data = await res.json();
  console.log(data.petData)
  displayDetails(data.petData);
};

const displayDetails = (item) => {
  const detailContainer = document.getElementById("modal-content");
  detailContainer.innerHTML="";
  const details=document.createElement('div')
  details.innerHTML = `
  <div class="">
   <img class="w-full mb-2" src=${item.image} /></div>
   <h2 class="text-xl font-bold text-txt mb-2">${item.pet_name}</h2>
   <div class=" flex justify-start gap-3 mb-3">
   <div>
    <p><span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=32&id=14970&format=png" alt="" srcset=""> 
    Breed: ${item.breed}</span></p>
    <p><span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=24&id=19766&format=png" alt="" srcset=""> 
      Gender: ${item.gender}</span></p>
    <p><span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=24&id=19766&format=png" alt="" srcset=""> 
       Vaccinated Status: ${item.vaccinated_status}</span></p>
       </div>
     <div>
    <p><span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=24&id=4p2G9EBQbqA4&format=png" alt="" srcset=""> 
    Birth: ${item.date_of_birth}</span></p>
    <p><span class="text-sm text-gray-500"><img class="h-5 w-5 float-left mr-2" src="https://img.icons8.com/?size=24&id=85107&format=png" alt="" srcset=""> 
       Price: ${item.price}</span></p>
       </div>
    </div>
    <div class="">
     <h3 class="font-bold mb-2">Details Information</h3>
     <p>${item.pet_details}</p>
  </div>
  `;
  detailContainer.append(details)
  document.getElementById("customModal").showModal();
};

//Adopt Modal
function loadCounter(disId) {
  const modal = document.getElementById('my_modal_3');
  const countdownElem = document.getElementById('countdown');
  const adoptButton = document.getElementById(`adopt-${disId}`); 
  let countdown = 3; 

  // Show the modal
  modal.showModal();

  // Disable closing the modal by ESC or clicking outside
  modal.addEventListener('cancel', (e) => e.preventDefault());
  modal.addEventListener('close', (e) => e.preventDefault());

  // Display initial countdown
  countdownElem.innerText = `${countdown}`;

  // Start the countdown
  const interval = setInterval(() => {
      countdown--;
      countdownElem.innerText = `${countdown}`;
      if (countdown === 0) {
          clearInterval(interval); 
          modal.close(); 
          adoptButton.disabled=true;
          adoptButton.classList="bg-gray-300 mt-2 px-4 py-2 rounded-md cursor-not-allowed opacity-50"; 
      }
  }, 1000); 
  
}


loadPets()
fetchCategory()