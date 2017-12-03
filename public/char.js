var playerName = "Uninitialized";
var playerLevel = 0;
var playerMaxHP = 0;
var playerHP = 0;
var playerSTR = 0;
var playerDEF = 0;
var playerEXP = 0;

var slime = {name:"Slime", hp:50, maxhp:50, exp:5, str:5, def:2};
var rabbit = {name:"Rabbit", hp:70, maxhp:70, exp:25, str:6, def:3};
var wolf = {name:"Wolf", hp:150, maxhp:100, exp:60, str:11, def:4};
var bear = {name:"Bear", hp:250, maxhp:200, exp:150, str:12, def:7};
var goblin = {name:"Goblin", hp:100, maxhp:100, exp:210, str:18, def:7};
var orc = {name:"Orc", hp:250, maxhp:250, exp:450, str:20, def:12};
var dragon = {name: "Dragon", hp:1000, maxhp:1000, exp:0, str:30, def:22};
var dragonSpawned = false;

function initializeValues(name, hp, str, def, exp) {
	playerName = name;
	playerMaxHP = playerHP = hp;
	playerSTR = str;
	playerDEF = def;
	playerEXP = exp;
	playerLevel = Math.round(Math.sqrt(exp/20)) + 1;

	document.getElementById("playerName").value = playerName;
	document.getElementById("playerLevel").value = playerLevel;
	document.getElementById("playerHP").value = playerHP;
	document.getElementById("playerSTR").value = playerSTR;
	document.getElementById("playerDEF").value = playerDEF;
	document.getElementById("playerEXP").value = playerEXP;

	document.getElementById("slimeHP").value = slime.hp;
	document.getElementById("rabbitHP").value = rabbit.hp;
	document.getElementById("wolfHP").value = wolf.hp;
	document.getElementById("bearHP").value = bear.hp;
	document.getElementById("goblinHP").value = goblin.hp;
	document.getElementById("orcHP").value = orc.hp;
	document.getElementById("dragonHP").value = dragon.hp;
}

function updateVals() {
	document.getElementById("playerName").value = playerName;
	document.getElementById("playerLevel").value = playerLevel;
	document.getElementById("playerHP").value = playerHP;
	document.getElementById("playerSTR").value = playerSTR;
	document.getElementById("playerDEF").value = playerDEF;
	document.getElementById("playerEXP").value = playerEXP;

	document.getElementById("slimeHP").value = slime.hp;
	document.getElementById("rabbitHP").value = rabbit.hp;
	document.getElementById("wolfHP").value = wolf.hp;
	document.getElementById("bearHP").value = bear.hp;
	document.getElementById("goblinHP").value = goblin.hp;
	document.getElementById("orcHP").value = orc.hp;
	document.getElementById("dragonHP").value = dragon.hp;
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
	//get enemy object out of name in string
	var target;
	var isDragon = false;
	var isOrc = false;
	if (enemy == 'slime') {
		target = slime;
	} else if (enemy == 'rabbit') {
		target = rabbit;
	} else if (enemy == 'wolf') {
		target = wolf;
	} else if (enemy == 'bear') {
		target = bear;
	} else if (enemy == 'goblin') {
		target = goblin;
	} else if (enemy == 'orc') {
		target = orc;
		isOrc = true;
	} else if (enemy == 'dragon') {
		target = dragon;
		isDragon = true;
	} else {
		console.err("Tried to attack an enemy that doesn't exist: " + enemy);
	}

	//deal dmg
	var dmgGiven = Math.max(playerSTR - target.def, 0);
	target.hp -= dmgGiven;
	addLine("You attack " + target.name + " for " + dmgGiven + " damage.");

	//see if dead
	if (target.hp > 0) {
		var dmgReceived = Math.max(target.str - playerDEF, 0);
		playerHP -= dmgReceived;
		addLine(target.name + " attacks you for " + dmgReceived + " damage.");

		if (isOrc && dmgReceived < 1 && !dragonSpawned) {
			confirm("The strongest monster does no damage do you. You seek out a heartier challenge.");
			addLine("You hear reports of a dragon appearing to the south.");
			addLine("This beast threatens your peaceful life of slaughtering the forest creatures...");
			addLine("Your quest cannot be truly over until this enemy is vanquished.");
			//Make dragon button visible.
			document.getElementById('dragon_row').style.display = 'table-row';
			dragonSpawned = true;
		}

		//see if counter-attack killed you
		if (playerHP > 0) {
			//You lived. Do nothing?
		} else {
			//You died. Show msg and reset stats.
			addLine("You died! Next time, maybe dont attack the " + target.name + ".");
			playerHP = playerMaxHP;
			target.hp = target.maxhp;
		}
	} else {
		//enemy died, grant exp, respawn monster
		addLine(target.name + " died.");
		addLine("You gain " + target.exp + " experience points.");
		playerEXP += target.exp;
		target.hp = target.maxhp;

		var checkLevel = Math.round(Math.sqrt(playerEXP/20)) + 1;
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
    		addLine("Level up! You are now level " + playerLevel);
		}
		if (isDragon) {
    		//You've defeated the boss.
    		confirm('You have defeated the great dragon and all the people are super stoked about it.');
    		addLine('Congrats on that.');
    		addLine('Good job.');
    		addLine('Maybe go do something worthwhile now.');
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