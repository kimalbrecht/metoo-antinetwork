
///////////////////
///////////////////
/////////////////// Text Overlays
///////////////////
///////////////////

/////////////////// About

document.getElementById("bottomContainer").onclick = function() { aboutOpen() };

function aboutOpen() {
	d3.selectAll('.overlayBG').style('display', 'none');
	document.getElementById("aboutText").style.display = "flex";

	d3.selectAll(".selected").attr("class", "navText tip");
	document.getElementById("bottomHeadline").classList.add("selected");
	removeText();
}
document.getElementById("aboutText").onclick = function() { aboutClose() };

function aboutClose() {
	document.getElementById("aboutText").style.display = "none";
	d3.selectAll(".selected").attr("class", "navText tip");
}

/////////////////// Info

document.getElementById("topHeadline").onclick = function() { infoOpen() };

function infoOpen() {
	d3.selectAll('.overlayBG').style('display', 'none');
	document.getElementById("infoText").style.display = "flex";

	// d3.selectAll('.infoTexts').style('display', 'none');

	// if (currentView == 0) {
	// 	document.getElementById("whyIDidntReport").style.display = "flex";
	// } else {
	// 	document.getElementById("meTooOnly").style.display = "flex";
	// }

	d3.selectAll(".selected").attr("class", "navText tip");
	document.getElementById("topHeadline").classList.add("selected");

	removeText();
}
document.getElementById("infoText").onclick = function() { infoClose() };

function infoClose() {
	document.getElementById("infoText").style.display = "none";
	d3.selectAll(".selected").attr("class", "navText tip");
}

///////////////////
///////////////////
/////////////////// Vis Interface Selection
///////////////////
///////////////////

function visChange(value) {
	currentView = value;

	document.getElementById("analysisText").style.display = "none";

	document.getElementById("leftHeadline").classList.remove("analysisSelected");

	document.getElementById("visText").style.display = "none";
	document.getElementById("vis").innerHTML = "";

	setupVis();
}

document.getElementById("card0").onclick = function() { visChange(0) };
document.getElementById("card1").onclick = function() { visChange(1) };
document.getElementById("card2").onclick = function() { visChange(2) };
document.getElementById("card3").onclick = function() { visChange(3) };

document.getElementById("rightContainer").onclick = function() { visOpen() };

function visOpen() {
	d3.selectAll('.overlayBG').style('display', 'none');
	document.getElementById("visText").style.display = "flex";

	d3.selectAll(".selected").attr("class", "navText tip");
	document.getElementById("rightHeadline").classList.add("selected");
	removeText();
}

document.getElementById("visText").onclick = function() { visClose() };

function visClose() {
	document.getElementById("visText").style.display = "none";
	d3.selectAll(".selected").attr("class", "navText tip");
}

///////////////////
///////////////////
/////////////////// Analysis
///////////////////
///////////////////

var analysisText = "<text>Using the collection gathered and curated by Radcliffe’s Schlesinger Library, home of the nation’s leading archive devoted to the history of American women, our research analyzed, filtered, and visualized one million randomly selected tweets from the #metoo movement. Through essay and visualization, this introduction explains how our research produced the diagrams offered throughout this site.</text>"

document.getElementById("leftContainer").onclick = function() { visAnalysis() };

function visAnalysis() {

	removeText();

	d3.select('#infoText').select('.overlayText').html(analysisText)

	document.getElementById("infoText").style.display = "none";
	document.getElementById("visText").style.display = "none";
	document.getElementById("aboutText").style.display = "none";

	d3.selectAll(".selected").attr("class", "navText tip");

	document.getElementById("leftHeadline").classList.add("analysisSelected");

	document.getElementById("vis").innerHTML = "";
	document.getElementById("analysisText").style.display = "block";

	startAnalysis();
}

// visAnalysis(); // for debugging
setupVis();

