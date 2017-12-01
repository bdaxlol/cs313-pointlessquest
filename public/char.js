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