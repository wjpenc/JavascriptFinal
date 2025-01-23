/*
1. Responsive Nav Bar with 3 pages
  1. Home Page: Animated Images (Responds to scroll), Basic information about the club 
  2. Interactive Map: Contains markers and uses the Google Maps API
  3. Sign Up Page: Utilizes a JSON Bin to display and add new members
*/

document.addEventListener("scroll", (e) => {
  let i = document.getElementById("mainimg");
  let scrollpos = window.scrollY;
  let fadeinstart = 700;
  let fadeinend = 900
  let fadeoutstart = 1500;
  let fadeoutend = 1600;
  //calculate opacity given scroll position
  let opacity = 0;
  if(scrollpos < fadeinstart){
    opacity = 0;
  }else if(scrollpos > fadeinstart && scrollpos < fadeinend){
    opacity = fadeinstart/scrollpos;
  }else if(scrollpos > fadeinend && scrollpos < fadeoutstart){
    opacity = 1;
  }else if(scrollpos > fadeoutstart && scrollpos < fadeoutend){
    opacity = 1 - (fadeoutstart/scrollpos);
  }else{
    opacity = 0;
  }
  i.style.opacity = opacity;
})



document.addEventListener("scroll", (e) => {
  let scrollpos = window.scrollY;
  let sections = document.querySelectorAll(".section");
  let navLinks = document.querySelectorAll("nav ul li a");
  let secTop = 0;
  let secHeight = 0;
  for(let i = 0; i < sections.length; i++){
    secTop = sections[i].offsetTop;
    secHeight = sections[i].offsetHeight;
    if(scrollpos >= secTop && scrollpos < (secTop + secHeight)){
      navLinks.forEach((link) => link.style.backgroundColor = "");
      navLinks[i].style.backgroundColor = "red";
    }
  }
})

let carousel = document.querySelectorAll(".carouselimg");
let modal = document.getElementById("modal");
let modalcont = document.getElementById("modalimg");
let close = document.getElementById("close");
let prevbut = document.getElementById("prev");
let nextbut = document.getElementById("next");
let currimg = 0;

carousel.forEach((e, i) => {
  e.addEventListener("click", () => {
    console.log("hello");
    modalcont.src = e.src;
    modal.style.display = "flex";
  })
})

close.addEventListener("click", (e) => {
  modal.style.display = "none";
})



nextbut.addEventListener("click", (e) =>{
  if(currimg == carousel.length - 1){
    currimg = 0;
  }else{
    currimg++;
  }

  updateCarousel();
})

prevbut.addEventListener("click", (e) =>{
  if(currimg == 0){
    currimg = carousel.length - 1;
  }else{
    currimg--;
  }
  updateCarousel();
})

const updateCarousel = () => {
  carousel.forEach((e, i) => {
     if(currimg == i){
       e.style.display = "block";
     }else{
       e.style.display = "none";
     }
  })
}

let members = document.getElementById("members");
let name = document.getElementById("nameinput");
let contact = document.getElementById("emailinput");
let donation = document.getElementById("donationinput");
let container = document.getElementById("joinedcont");

let apiurl = "https://api.jsonbin.io/v3/b/673e991fad19ca34f8cd877e";
const getDB = async () => {
  const response = await fetch(apiurl + "/latest", {
    method: "get",
    headers: {
      "Content-Type" : "application/json",
      "X-Master-Key" : "$2a$10$AudABWhYsthsGn/JyXMKC.MBB2xRRSXqoG0/OGgRcXmgFgqtr4rc."
    }
  });
  const db = await response.json();
  return db.record;
}

const addMember = async() => {
  const oldDB = await getDB();
  console.log("awda");
  oldDB.memberlist.push({name: name.value, contactemail: contact.value, initialdonation: donation.value, id: Math.floor(Math.random()*99999)});
  const response = await fetch(apiurl, {
    method: "put",
    body: JSON.stringify(oldDB),
    headers: {
      "Content-Type" : "application/json",
      "X-Master-Key" : "$2a$10$AudABWhYsthsGn/JyXMKC.MBB2xRRSXqoG0/OGgRcXmgFgqtr4rc."
    }
  });
  const newDB = await response.json();
  renderDB(newDB.record);
}

const renderDB = (db) => {
  while(members.firstChild){
    members.removeChild(members.firstChild)
  }
  db.memberlist.forEach((e , i) => {
    let member = document.createElement("div");
    let name2 = document.createElement("div");
    name2.className = "dropdown";
    let dropbut = document.createElement("button");
    dropbut.className = "dropbut";
    dropbut.innerHTML = e.name;
    let dropcont = document.createElement("div");
    dropcont.className = "dropdown-content";
    let contactinfo = document.createElement("div");
    contactinfo.innerHTML = e.contactemail;
    let donationamount = document.createElement("div");
    donationamount.innerHTML = e.initialdonation;
    dropcont.append(contactinfo);
    dropcont.append(donationamount);
    name2.append(dropbut);
    name2.append(dropcont);
    member.append(name2);
    members.appendChild(member);
  })
}


getDB().then((db) => {
  renderDB(db);
})