const matchUrl = "https://api.opendota.com/api/matches/";
const heroUrl = "https://api.opendota.com/api/heroStats";
const mainUrl = "https://api.opendota.com";

let findButton = document.querySelector("#findButton");
let inputForm = document.querySelector("#matchId");
let loadBlock = document.querySelector("#load");
let loadedBlock = document.querySelector("#loaded");
let matchIdTitle = document.querySelector("#matchIdTitle");
let matchId;
let matchJson;
let heroesJson;

searchHero();
findButton.addEventListener("click", () => {
  matchId = inputForm.value;
  inputForm.value = "";
  loadedBlock.hidden = true;
  searchMatch();
});

async function searchMatch() {
  let response = await fetch(matchUrl + matchId);
  loadBlock.hidden = false;
  if (response.ok) {
    matchJson = await response.json();
    loadBlock.hidden = true;
    loadedBlock.hidden = false;

    console.log(matchJson);
    showStatMatch();
  } else {
    //todo
  }
}

function showStatMatch() {
  matchIdTitle.textContent = "Match ID: " + matchJson.match_id;
  whoWin();

  let radiant = [];
  let dire = [];

  for (let i = 0; i < 10; i++) {
    let hero = findHeroById(matchJson.picks_bans[i].hero_id);
    let heroBclock = document.createElement("div");

    heroBclock.innerHTML =
      "<img width = '100' src = '" +
      mainUrl +
      hero.img +
      "'>" +
      hero.localized_name;

    if (matchJson.picks_bans[i].team == 0) {
      heroBclock.className = "col text-success";
      radiant.push(heroBclock);
    } else {
      heroBclock.className = "col text-danger";
      dire.push(heroBclock);
    }
  }

  radiant.forEach((value) => loadedBlock.append(value));
  dire.forEach((value) => loadedBlock.append(value));
}

function whoWin() {
  let whWinTitle = document.createElement("h2");

  if (matchJson.radiant_win) {
    whWinTitle.innerHTML = "Radiant win!";
    whWinTitle.className = "text-success";
  } else {
    whWinTitle.innerHTML = "Dire win!";
    whWinTitle.className = "text-danger";
  }
  loadedBlock.append(whWinTitle);
}

function findHeroById(heroID) {
  for (let i = 0; i < heroesJson.length; i++) {
    if (heroesJson[i].id === heroID) {
      return heroesJson[i];
    }
  }
}

async function searchHero() {
  heroesJson = await (await fetch(heroUrl)).json();
}
