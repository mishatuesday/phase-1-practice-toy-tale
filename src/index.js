let addToy = false;
const heart = '♥'
document.addEventListener("click", (e) => wasItLiked(e))
// document.addEventListener("click", wasItLiked(e)) // didn't work!
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      addBtn.textContent = "hide form";
    } else {
      toyFormContainer.style.display = "none";
      addBtn.textContent = "Add a new toy!"
    }
  });

  const createBtn = document.getElementsByClassName("submit")[0]
  createBtn.addEventListener("click", (e) => createToy(e))

// render the toys
const thetoys = fetch("http://localhost:3000/toys")
.then((resp) => resp.json())
.then((toysObj) => renderToys(toysObj))


function renderToys(toysObj) {
  toysObj.forEach((toy) => renderToyCard(toy))
}

function renderToyCard(toy) {
  // create a DIV node
  // put the toy data in it
  // add the node to the document in the right place.
  const toyCollection = document.getElementById("toy-collection")
  const toyCard = document.createElement("div")
  const toyName = document.createElement("h2")
  const toyImg = document.createElement("img")
  const toyLikes = document.createElement("p")
  const likeBtn = document.createElement("button")

  toyCard.className = "card"
  toyName.textContent = toy["name"]
  toyImg.src = toy["image"]
  toyImg.className = "toy-avatar"
  toyLikes.textContent = `${toy.likes} likes  `
  toyLikes.id = `likes${toy.id}`
  console.log(toyLikes.id)
  
  likeBtn.textContent = `Like ${heart}`
  likeBtn.className = "like-btn"
  likeBtn.id = toy.id

  toyCollection.appendChild(toyCard)
  toyCard.appendChild(toyName)
  toyCard.appendChild(toyImg)
  toyCard.appendChild(toyLikes)
  toyCard.appendChild(likeBtn)
//
//  no longer an issue:
//  WHEN RENDERING NEW TOY CARD, THERE IS NO TOY ID TO SET ELEMENT ID'S
//  this was fixed by using the JSON POST response instead of the new toy object
//  because that is returned wtih a new id.
}

// add new toy
function createToy(e) {
  e.preventDefault()
  const newName = document.getElementsByClassName("input-text")[0]
  const newImg = document.getElementsByClassName("input-text")[1]
  const newToyObj = {
    name: newName.value,
    image: newImg.value,
    likes: 0
    }

  //send to database
  const configObject= {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(newToyObj)
  }
// fix below line... it used to start with fetch
  fetch("http://localhost:3000/toys", configObject)
  .then(resp => resp.json())
  .then(resp => renderToyCard(resp))
  .catch(err => alert(err))

  // reset the form
  newName.value = null
  newImg.value = null
  toyFormContainer.style.display = "none";
  addBtn.textContent = "Add a new toy!"
  addToy = !addToy;
}

function wasItLiked(e) {
  e.preventDefault()
  if (e.target.className === "like-btn") {
    likedToyUrl = `http://localhost:3000/toys/${e.target.id}`
    //make a post request for the item so we can get the current number of likes
    const theLikedToy = fetch(likedToyUrl)
    .then(toy => toy.json())
    .then(toy => sendToDb(toy))

  }
}

function sendToDb(shmoy) {
  const updateUrl = `http://localhost:3000/toys/${shmoy["id"]}`
  let newLikes = shmoy["likes"]
  newLikes++
  const updateLikeObj = {
    likes: newLikes 
  }
  const configObject= {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(updateLikeObj) 
  }

  fetch(updateUrl, configObject)
  .then(resp => updateToyCardWithLikes(shmoy["id"], newLikes)) // this should be revising the affected card
}

function updateToyCardWithLikes(toyId, likes) {
  document.getElementById(`likes${toyId}`).textContent = `${likes} likes  `
}