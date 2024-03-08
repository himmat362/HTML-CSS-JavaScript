let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let loot;
let cost;
let hit;
let inventory = [""];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  {
    name: "punch",
    power: 5,
    weaponCost: 0
  },
  {
    name: "wooden spear",
    power: 10,
    weaponCost: 35
  },
  {
    name: "dagger",
    power: 25,
    weaponCost: 70
  },
  {
    name: "claw hammer",
    power: 50,
    weaponCost: 140
  },
  {
    name: "sword",
    power: 85,
    weaponCost: 300
  }
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];

const locations = [
  {
    name: "town square",
    button_text: ["Go to store", "Go to cave", "Go to Fight dragon"],
    button_function: [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    button_text: ["Buy 10 health for 10 gold", "Buy " + weapons[currentWeapon + 1].name + " for " + weapons[currentWeapon + 1].weaponCost + " gold", "Go to town square"],
    button_function: [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    button_text: ["Fight slime", "Fight fanged beast", "Go to town square"],
    button_function: [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    button_text: ["Attack", "Dodge", "Run"],
    button_function: [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    button_text: ["Go to town square", "Go to town square", "Go to town square"],
    button_function: [goTown, goTown, easterEgg],
    text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold"
  },
  {
    name: "lose",
    button_text: ["REPLAY?", "REPLAY?", "REPLAY?"],
    button_function: [restart, restart, restart],
    text: "You die."
  },
  {
    name: "win",
    button_text: ["REPLAY?", "REPLAY?", "REPLAY?"],
    button_function: [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME!"
  },
  {
    name: "easter egg",
    button_text: ["2", "8", "Go to town square?"],
    button_function: [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
]

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location.button_text[0];
  button2.innerText = location.button_text[1];
  button3.innerText = location.button_text[2];
  text.innerText = location.text;
  button1.onclick = location.button_function[0];
  button2.onclick = location.button_function[1];
  button3.onclick = location.button_function[2];
}

function goTown() {
  update(locations[0]);
}
function goStore() {
  update(locations[1]);
}
function goCave() {
  update(locations[2])
}

/* */
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  }
  else {
    text.innerText = "You do not have enough gold to buy health.";
  }
};
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    cost = weapons[currentWeapon + 1].weaponCost;
    if (gold >= cost) {
      gold -= cost;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      locations[1].button_text[1] = "Buy " + weapons[currentWeapon + 1].name + " for " + weapons[currentWeapon + 1].weaponCost + " gold"
      update(locations[1]);
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += "In your inventory you have " + inventory;
    }
    else {
      text.innerText = "You don't have enough gold to buy a " + weapons[currentWeapon + 1].name + ".";
    }
  }
  else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
};
function sellWeapon() {
  if (inventory.length > 1) {
    gold += gold;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
  }
  else {
    text.InnerText = "Don't sell your only weapon!";
  }
}

/* */
function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}
function fightDragon() {
  fighting = 2;
  goFight();
}
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks."
  text.innerText += "You attack it with your " + weapons[currentWeapon].name + "."
  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  }
  else {
    text.innerText += "You miss";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  }
  else if (monsterHealth <= 0) {
    fighting == 2 ? wingame() : defeatMonster();
  }

  if (Math.random() <= 0.1 && inventory.lengh >= 2) {
    text.innerText += "Your " + inventory.pop() + " breaks!";
    currentWeapon--;
  }
}
function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
}
function defeatMonster() {
  loot = Math.floor(monsters[fighting].level * 6.7);
  gold += loot;
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  locations[4].text = "The monster screams \"Arg!\" as it dies. You gain experience points and find " + loot + " goldcoins"
  update(locations[4]);
}
function lose() {
  update(locations[5]);
}
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  update(locations[0]);
}
function wingame() {
  update(locations[6]);
}

/* */
function getMonsterAttackValue(level) {
  hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit;
}
function isMonsterHit() {
  return Math.random() > 0.2 || health < 40;
}

/* */
function easterEgg() {
  update(locations[7]);
}
function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}
function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    number.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.indexOf(guess) !== -1) {
    text.innerText += "Right! You win 150 gold!";
    gold += 150;
    goldText.innerText = gold;
  }
  else {
    text.innerText += "Wrong! You lose 50 health!";
    health -= 50;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
