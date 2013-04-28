/*
  CMLC Hiking Challenge
  Bob Cannon, July 2012
 */

/*global $, localStorage, console, navigator, alert, window, google, document */

var fullMap,
    zoomedMap,
    myRoute,
    stepDisplay,
    stepArray = [];

var globals = (function () {
	'use strict';
	var trailId;
	return {
        setTrailId : function (id) {
        	'use strict';
            trailId = id;
        },
        getTrailId : function () {
        	'use strict';
            return trailId;
        }
    };
})();

function error(msg) {
	'use strict';
	console.log("Entering error function with message: ", msg);
}

function setTrailheadName(thname) {
	'use strict';
	localStorage.setItem("trailheadName", thname);
}

function getTrailheadName() {
	'use strict';
	return localStorage.getItem("trailheadName");
}

function settrailDirectionsHTML(content) {
	'use strict';
	localStorage.setItem("trailDirectionsPageHTML", content);
}

function gettrailDirectionsHTML() {
	'use strict';
	return localStorage.getItem("trailDirectionsPageHTML");
}

function setMyRouteSteps(length) {
	'use strict';
	// console.log("Entering setMyRouteSteps.");
	localStorage.setItem("maxSteps", Number(length));
	localStorage.setItem("stepNumber", Number(0));
	// console.log("Leaving setMyRouteSteps");
}

/*
 * a d d N e x t R o u t e S t e p
 */
function addNextRouteStep() {
	'use strict';
	// console.log("Entering addNextRouteStep");
	var thisStep = localStorage.getItem("stepNumber");
	var arrayLength = localStorage.getItem("maxSteps");
	var nextStep = Number(thisStep) + Number(1);
	if (nextStep < arrayLength) {
		localStorage.setItem("stepNumber", nextStep);
	}
	// console.log("Leaving addNextRouteStep");
	return (thisStep);
}

/*
 * s u b t r a c t N e x t R o u t e S t e p
 */
function subtractNextRouteStep() {
	'use strict';
	// console.log("Entering subtractNextRouteStep");
	var thisStep = localStorage.getItem("stepNumber");
	var nextStep = Number(thisStep) - Number(1);
	if (nextStep >= 0) {
		localStorage.setItem("stepNumber", nextStep);
	}
	// console.log("Leaving subtractNextRouteStep");
	return (thisStep);
} // end subtractNextRouteStep

/*
 * b u i l d T r a i l S e l e c t i o n L i s t
 */
function buildTrailSelectionList() {
	'use strict';
	// console.log("Entering buildTrailSelectionList");
	var trailId = new String;
	$.getJSON("trails.json", function (data) {
		$('trailSelectionList li').remove();
		$.each(data.trails, function (trailhead, trailInfo) {
			trailId = $(this).attr('id');
			var appendText =
				'<li> <a href="#" id= ' + trailInfo.id + ' ' +
				'onclick="trailLinkClicked(\'' + trailId + '\')" >' +
				'<h4>' + trailInfo.name + '</h4>' +
				'</li>';
			$('#trailSelectionList').append(appendText);
		});
		$('#trailSelectionList').listview('refresh');
	});
	// console.log("Leaving buildTrailSelectionList");
} // end buildTrailSelectionList

/*
 * g e t U r l V a r s
 */
function getUrlVars() {
	'use strict';
	// console.log("Entering getUrlVars");
	var vars = [], hash;
	var hashes = window.location.href.slice(
			window.location.href.indexOf('?') + 1
		).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	//console.log("Leaving getUrlVars -- will return " + vars);
	return vars;
} // end getUrlVars

/*
 * b u i l d T r a i l D i r e c t i o n s P a g e
 */
function buildTrailDirectionsPage(trailhead) {
	'use strict';
	// console.log("Entering buildTrailDirectionsPage w/ trailhead = " + trailhead);
	$.getJSON("trails.json", trailhead, function (data) {
		var trailDirectionsHTML = "<div class='myfigure-and-description'>";
		trailDirectionsHTML += "<div class='myfigure'>";
		trailDirectionsHTML += "<img src= 'img/" + data.trails[trailhead].trailImage + "' ";
		trailDirectionsHTML += "alt='Map of the trail' class='flexible-image' />";
		trailDirectionsHTML += "</div>"; // end myfigure
		trailDirectionsHTML += "<div class='description'>";
		trailDirectionsHTML += data.trails[trailhead].hikeChallenge;
		trailDirectionsHTML += data.trails[trailhead].trailheadDescription;
		trailDirectionsHTML += data.trails[trailhead].hikingDirections + " ";
		trailDirectionsHTML += "</div>"; // end description
		trailDirectionsHTML += "</div>"; // end myfigure and description
		setTrailheadName(trailhead);
		settrailDirectionsHTML(trailDirectionsHTML);
		$('#trailDirectionsPageCONTENT').html(trailDirectionsHTML);
	});
	// console.log("Leaving buildTrailDirectionsPage");
} // end buildTrailDirectionsPage

/*
 * z o o m T o S t e p
 */
function zoomToStep(stepNumber, text) {
	'use strict';
	// console.log("Entering zoomToStep with stepNumber = " + stepNumber);
	stepDisplay.setContent(text);
	zoomedMap.panTo(myRoute.steps[stepNumber].start_location);
	stepDisplay.open(zoomedMap, stepArray[stepNumber]);
	// console.log("Leaving zoomToStep");
} // end zoomToStep

/*
 * b u i l d S t e p A r r a y
 */
function buildStepArray(directionResult) {
	'use strict';
	// console.log("Entering buildStepArray");
	// For each step, build step data and addd the text to the step's
	// info window. Also, attach the step data to an arry so we
	// can keep track of it and remove it when calculating a new route.
	myRoute = directionResult.routes[0].legs[0];
	setMyRouteSteps(myRoute.steps.length);
	for (var i = 0; i < myRoute.steps.length; i++) {
		var marker = new google.maps.Marker({
			position : myRoute.steps[i].start_location,
			map : zoomedMap
		});
		marker.setVisible(false);
		stepArray[i] = marker;
	}
	// console.log("Leaving buildStepArray");
} // end buildStepArray

/*
 * c a l c u l a t e R o u t e
 */
function calculateRoute(currentPosition, directionsService,
		fullDirectionsDisplay, stepDirectionsDisplay) {
	'use strict';
	// console.log("Entering calculateRoute");
	// Clear out entries in stepArray before building new directions
	for (var i = 0; i < stepArray.length; i++) {
		stepArray[i].setMap(null);
	}
	var trailhead = getTrailheadName();
	$.getJSON("trails.json", function(data) {
		var targetDestination = new google.maps.LatLng(
			data.trails[trailhead].latitude,
			data.trails[trailhead].longitude
		);
		if ((!(currentPosition == '')) && (!(targetDestination == ''))) {
			var request = {
				origin : currentPosition,
				destination : targetDestination,
				travelMode : google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					fullDirectionsDisplay.setDirections(response);
				}
			});
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					stepDirectionsDisplay.setDirections(response);
					buildStepArray(response);
				}
			}); // end directionsService.route ...
		} // end if
	}); // end getJSON
	// console.log("Leaving calculateRoute");
} // end calculateRoute

/*
 * i n i t i a l i z e M a p A n d C a l c u l a t e R o u t e
 */
function initializeMapAndCalculateRoute(lat, lon) {
	'use strict';
	var directionsService = new google.maps.DirectionsService();
	var currentPosition = new google.maps.LatLng(lat, lon);
	if (!currentPosition) {
		alert("Couldn't get your position -- is geolocation enabled?");
		$.mobile.changePage($('../index.html'), {});
	}
	var mapOptions = {
		zoom : 13,
		center : currentPosition,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	fullMap = new google.maps.Map(document.getElementById('mapCanvas'),
			mapOptions);
	var rendererOptions = {
		map : fullMap
	};
	var fullDirectionsDisplay = new google.maps.DirectionsRenderer(
			rendererOptions);
	mapOptions = {
		zoom : 25,
		center : currentPosition,
		preserveViewport : true,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	zoomedMap = new google.maps.Map(document.getElementById('stepCanvas'),
			mapOptions);
	rendererOptions = {
		preserveViewport : true,
		map : zoomedMap
	};
	var stepDirectionsDisplay = new google.maps.DirectionsRenderer(
			rendererOptions);

	// Instantiate an infowindow to hold step text.
	stepDisplay = new google.maps.InfoWindow();

	// calculate Route
	calculateRoute(currentPosition, directionsService, fullDirectionsDisplay,
			stepDirectionsDisplay);
} // end initializeMapAndCalculateRoute

/*
 * l o c E r r o r
 */
function locError(error) {
	'use strict';
	// the current position could not be located
	alert("Couldn't get your position -- is geolocation enabled?");
	$.mobile.changePage($('../index.html'), {});
} // end locError

/*
 * l o c S u c c e s s
 */
function locSuccess(position) {
	'use strict';
	// initialize map with current position and calculate the route
	// console.log("Entering locSuccess");
	initializeMapAndCalculateRoute(position.coords.latitude,
			position.coords.longitude);
	// console.log("Leaving locSucess");
} // end locSuccess

/*
 * i n s e r t D i s t a n c e
 */
function insertDistance(stepNum) {
	'use strict';
	// Insert the driving distance into the instructions that come from
	// Google. There was a line spacing problem, so there are several
	// special cases here.
	// console.log("Entering insertDistance");
	var instructions = myRoute.steps[stepNum].instructions;
	var distance = myRoute.steps[stepNum].distance.text;
	var directionsIndex = instructions.indexOf("Destination");
	var driveLine = "Drive <b>" + distance + "</b>";
	var returnText;
	if (directionsIndex < 0) {
		returnText = instructions;
		if (instructions.indexOf("Continue") > 0) {
			returnText += driveLine;
		} else {
			returnText += "<br>" + driveLine;
		}
		return returnText;
	} else {
		// insert driving distance before anything else
		returnText = instructions.slice(0, directionsIndex - 29);
		if (instructions.indexOf("Continue") > 0) {
			returnText += driveLine;
		} else {
			returnText += "<br>" + driveLine;
		}
		returnText += instructions.slice(directionsIndex - 29);
		return returnText;
	}
	// console.log("Leaving insertDistance");
} // end insertDistance

/*
 * # h o m e P a g e - p a g e i n i t
 */
$('#homePage').live('pageinit', function() {
	'use strict';
	// console.log("Entering homePage pageinit");
	$.getJSON("trails.json", function(data) {
		$('#homeFigure').append(data.home.figure);
		$('#homeIntroduction').append(data.home.introduction);
	});
	// console.log("Leaving homePage pageinit");
}); // end #homePage pageinit

/*
 * # s e l e c t P a g e - p a g e i n i t
 */
$('#selectPage').live('pageinit', function(event) {
	'use strict';
	// console.log("Entering selectPage pageinit");
	buildTrailSelectionList();
	// console.log("Leaving selectPage pageinit");
});

/*
 * # t r a i l D i r e c t i o n s P a g e - p a g e s h o w
 */
$('#trailDirectionsPage').live("pageshow", function() {
	'use strict';
	// console.log("Entering trailDirectionsPage.pageshow.function");
	// "id" is appended to the url of the page
	var trailhead = getUrlVars()["id"];
	// "null" is a special case that I have created to indicate that I'm
	// returning back to trailDirectionsPage so I can use the directions
	// in local storage.
	if (trailhead == "null") {
		$('#trailDirectionsPageCONTENT').html(gettrailDirectionsHTML());
	} else {
		buildTrailDirectionsPage(trailhead);
	}
	// console.log("Leaving trailDirectionsPage.pageshow");
}); // end #trailDirectionsPage.live("pageshow" ...

/*
 * # m a p P a g e - p a g e i n i t
 */
$("#mapPage").live("pageinit", function() {
	'use strict';
	// find current position -- if success initialize map and calculate route
	// console.log("Entering mapPage.live.pageinit");
	$('#forward').live("click", function() {
		$('#mapCanvas').hide();
		var stepNum = addNextRouteStep();
		zoomToStep(stepNum, insertDistance(stepNum));
	});
	$('#backward').live("click", function() {
		$('#mapCanvas').hide();
		var stepNum = subtractNextRouteStep();
		zoomToStep(stepNum, insertDistance(stepNum));
	});
	// console.log("Leaving mapPage.live.pageinit");
}); // end #mapPage.live("pageinit" ...

/*
 * # m a p P a g e -- p a g e s h o w
 */
$("#mapPage").live("pageshow", function() {
	'use strict';
	// find current position -- if success initialize map and calculate route
	// console.log("Entering mapPage.live.pageshow");
	navigator.geolocation.getCurrentPosition(locSuccess, locError);
	// console.log("Leaving mapPage.live.pageshow");
}); // end #mappage.live.pageshow ...

/*
 * . r e f r e s h -- c l i c k
 */
$('.refresh').live("click", function() {
	'use strict';
	//console.log("Entering .refresh.live.click");
	//navigator.geolocation.getCurrentPosition(locSuccess, locError);
	$('#mapCanvas').show();
	$.mobile.changePage($('#mapPage'), {});
	//console.log("Leaving .refresh.live.click");
}); // end .refresh.live("click" ...

function trailLinkClicked(trailId) {
	console.log("trailLinkClicked: trailid is " + trailId);
	globals.setTrailId(trailId);
	console.log("trailLinkclicked: global value is " + globals.getTrailId());
} // end linkClickedlistingNumber

