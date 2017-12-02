var playerName = "Uninitialized";
var playerLevel = 0;
var playerMaxHP = 0;
var playerHP = 0;
var playerSTR = 0;
var playerDEF = 0;
var playerEXP = 0;

var slime = {name:"Slime", hp:50, exp:5, str:5, def:5};
var rabbit = {name:"Rabbit", hp:70, exp:8, str:6, def:8};
var wolf = {name:"Wolf", hp:150, exp:18, str:15, def:8};
var bear = {name:"Bear", hp:250, exp:30, str:19, def:15};
var goblin = {name:"Goblin", hp:100, exp:35, str:25, def:18};
var orc = {name:"Orc", hp:400, exp:65, str:30, def:25};

function initializeValues(name, hp, str, def, exp) {
	playerName = name;
	playerMaxHP = playerHP = hp;
	playerSTR = str;
	playerDEF = def;
	playerEXP = exp;
	playerLevel = Math.round(Math.sqrt(exp/20));

	document.getElementById("playerName").value = playerName;
	document.getElementById("playerLevel").value = playerLevel;
	document.getElementById("playerHP").value = playerHP;
	document.getElementById("playerSTR").value = playerSTR;
	document.getElementById("playerDEF").value = playerDEF;
	document.getElementById("playerEXP").value = playerEXP;
}

function updateVals() {
	document.getElementById("playerName").value = playerName;
	document.getElementById("playerLevel").value = playerLevel;
	document.getElementById("playerHP").value = playerHP + " / " playerMaxHP;
	document.getElementById("playerSTR").value = playerSTR;
	document.getElementById("playerDEF").value = playerDEF;
	document.getElementById("playerEXP").value = playerEXP;

	document.getElementById("slimeHP").value = slime.hp;
	document.getElementById("rabbitHP").value = rabbit.hp;
	document.getElementById("wolfHP").value = wolf.hp;
	document.getElementById("bearHP").value = bear.hp;
	document.getElementById("goblinHP").value = goblin.hp;
	document.getElementById("orcHP").value = orc.hp;
}

function increaseStat(id, val) {
	var initialVal;
	initialVal = parseInt(document.getElementById(id).value);
	document.getElementById(id).value = initialVal + val;

	var nextVal;
	nextVal = parseInt(document.getElementById("next" + id).innerHTML);
	document.getElementById("next" + id).innerHTML = nextVal + val;

	var statsLeft;
	statsLeft = parseInt(document.getElementById("statsRemaining").innerHTML);
	statsLeft -= 1;
	document.getElementById("statsRemaining").innerHTML = statsLeft;

	if (statsLeft == 0)
	{
		document.getElementById("submitBtn").style.visibility = 'visible';
		document.getElementById("hpBtn").style.visibility = 'hidden';
		document.getElementById("strBtn").style.visibility = 'hidden';
		document.getElementById("defBtn").style.visibility = 'hidden';
	}
}

function attackEnemy(enemy) {
	//deal dmg
	var dmgGiven = Math.max(playerSTR - enemy.def, 0);
	enemy.hp -= dmgGiven;
	addLine("You attack " + enemy.name + " for " + dmgGiven + " damage.");

	//see if dead
	if (enemy.hp > 0) {
		var dmgReceived = Math.max(enemy.str - playerDEF, 0);
		playerHP -= dmgReceived;
		addLine(enemy.name + " attacks you for " + dmgReceived + " damage.");

		//see if counter-attack killed you
		if (playerHP > 0) {
			//You lived. Do nothing?
		} else {
			//You died. Show msg and reset stats.
			addLine("You died! Next time, maybe dont attack the " + enemy.name + ".");
			playerHP = playerMaxHP;
			enemy.hp += dmgGiven;
		}
	} else {
		//enemy died, grant exp, respawn monster
		addLine(enemy.name + " died.");
		addLine("You gain " + enemy.exp + " experience points.");
		playerEXP += enemy.exp;

		var checkLevel = Math.round(Math.sqrt(playerEXP/20));
		if (checkLevel > playerLevel) {
			//you gained a level
			playerLevel = checkLevel;
			var stat = prompt("Level up! Pick a stat to increase!", "hp, def, or str");
    		if (stat == "hp") {
        		playerMaxHP += 5;
    		} else if (stat == "str") {
        		playerSTR += 1;
    		} else if (stat == "def") {
        		playerDEF += 1;;
    		} else {
        		confirm("I do not recognize that input. You get nothing.");
    		}
    		addLine("Level up! You are now level " + playerLevel)
		}
		playerHP = playerMaxHP;
	}
	updateVals();
}

function addLine(str) {
    var table = document.getElementById("scrollTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = str;
    updateScroll();
}

function updateScroll(){
    var element = document.getElementById("scrollDiv");
    element.scrollTop = element.scrollHeight;
}