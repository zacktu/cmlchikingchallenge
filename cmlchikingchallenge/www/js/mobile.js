/*
  CMLC Hiking Challenge
  Bob Cannon, July 2012
 */

/*global $, localStorage, console, navigator, alert, window, google, document */

var globals = (function () {
	'use strict';
	var trailId,
		latitude,
		longitude,
		zoomedMap,
		myRoute,
		stepDisplay,
		stepArray = [];
	return {
        setTrailId : function (id) {
        	'use strict';
            trailId = id;
        },
        getTrailId : function () {
        	'use strict';
            return trailId;
        },
        setLatitude : function (lat) {
        	'use strict';
        	console.log("setLatitude: entered with lat = " + lat);
            latitude = lat;
        },
        getLatitude : function () {
        	'use strict';
            return latitude;
        },
        setLongitude : function (long) {
        	'use strict';
            longitude = long;
        },
        getLongitude : function () {
        	'use strict';
            return longitude;
        },
        setZoomedMap : function(zm) {
        	'use strict';
        	zoomedMap = zm;
        },
        getZoomedMap : function() {
        	'use strict';
        	return zoomedMap;
        },
        setMyRoute : function(mr) {
        	'use strinct';
        	myRoute = mr;
        },
        getMyRoute : function() {
        	'use strict';
        	return myRoute;
        },
        setStepDisplay : function(sd) {
        	'use strict';
        	stepDisplay = sd;
        },
        getStepDisplay : function() {
        	'use strict';
        	return stepDisplay;
        },
        setStepArray : function(sa) {
        	'use strict';
        	stepArray = sa;
        },
        getStepArray : function() {
        	'use strict';
        	return stepArray;
        }
    };
})();

function error(msg) {
	'use strict';
	console.log("Entering error function with message: ", msg);
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
		globals.setTrailId(trailhead);
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
	var stepDisplay = globals.getStepDisplay();
	var zoomedMap = globals.getZoomedMap();
	var myRoute = globals.getMyRoute();
	var stepArray = globals.getStepArray();
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
	var zoomedMap = globals.getZoomedMap();
	var myRoute = directionResult.routes[0].legs[0];
	var stepArray = [];
	setMyRouteSteps(myRoute.steps.length);
	for (var i = 0; i < myRoute.steps.length; i++) {
		var marker = new google.maps.Marker({
			position : myRoute.steps[i].start_location,
			map : zoomedMap
		});
		marker.setVisible(false);
		stepArray[i] = marker;
	}
	globals.setMyRoute(myRoute);
	globals.setStepArray(stepArray);
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
	var stepArray = globals.getStepArray();
	for (var i = 0; i < stepArray.length; i++) {
		stepArray[i].setMap(null);
	}
	globals.setStepArray(stepArray);
	var trailhead = globals.getTrailId();
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
	var fullMap;
	var newZoomedMap;
	var stepDisplay;
	if (!currentPosition) {
		alert("Couldn't get your position -- is geolocation enabled?");
		$.mobile.changePage($('#homePage'), {});
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
	newZoomedMap = new google.maps.Map(document.getElementById('stepCanvas'),
			mapOptions);
	rendererOptions = {
		preserveViewport : true,
		map : newZoomedMap
	};
	globals.setZoomedMap(newZoomedMap);
	var stepDirectionsDisplay = new google.maps.DirectionsRenderer(
			rendererOptions);

	// Instantiate an infowindow to hold step text.
	stepDisplay = new google.maps.InfoWindow();
	globals.setStepDisplay(stepDisplay);

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
	$.mobile.changePage($('#homePage'), {});
} // end locError

/*
 * l o c S u c c e s s
 */
function locSuccess(position) {
	'use strict';
	var destinationLatitude,
		destinationLongitude;
	var myTrailId = globals.getTrailId();
	// initialize map with current position and calculate the route
	// console.log("Entering locSuccess");
	console.log("locSuccess: latitude = " + position.coords.latitude);
	console.log("locSuccess: longitude = " + position.coords.longitude);
	console.log("googleMaps.live.click: trailId is " + myTrailId);
	$.getJSON("trails.json", function(data) {
		destinationLatitude = data.trails[myTrailId].latitude;
		destinationLongitude = data.trails[myTrailId].longitude;
		console.log("locSuccess: destinationLatitude = " + destinationLatitude);
		console.log("locSuccess: destinationLongitude = " + destinationLongitude);
		console.log("googleMaps.live.click: this is where we show the map");
		//location.href = "https://maps.google.com/?q=loc:35.4607+-82.3681";
		var temphref = "https://maps.google.com/?q=loc:" + 
			destinationLatitude + "+" + destinationLongitude + 
			"+(XXXXXXX)";
		console.log("googleMaps.live.click: temphref = " + temphref);
		location.href = temphref;
	});

	/****
	globals.setLatitude(position.coords.latitude);
	console.log("locSuccess: returned from setLatitude");
	globals.setLongitude(position.coords.longitude);
	console.log("locSuccess: returned from setLongitude");
	****/
	/***
	initializeMapAndCalculateRoute(position.coords.latitude,
			position.coords.longitude);
	*****/
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
	var myRoute = globals.getMyRoute();
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
	//console.log("Entering trailDirectionsPage.pageshow.function");
	var trailhead = globals.getTrailId();
	buildTrailDirectionsPage(trailhead);
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
	$('#mapCanvas').show();
	$.mobile.changePage($('#mapPage'), {});
	//console.log("Leaving .refresh.live.click");
}); // end .refresh.live("click" ...

function trailLinkClicked(trailId) {
	//console.log("trailLinkClicked: trailId is " + trailId);
	globals.setTrailId(trailId);
	$.mobile.changePage($('#trailDirectionsPage'), {});
} // end linkClickedlistingNumber

$('#googleMaps').live('click', function() {
	var myTrailId = globals.getTrailId(),
		destinationLatitude,
		destinationLongitude;
	console.log("googleMaps.live.click: trailId is " + myTrailId);
	alert("After reaching the trailhead you can press the Android return " +
			"button to return to the trail instructions.");
	$.getJSON("trails.json", function(data) {
		destinationLatitude = data.trails[myTrailId].latitude;
		destinationLongitude = data.trails[myTrailId].longitude;
		destinationName = data.trails[myTrailId].name;
		console.log("locSuccess: destinationLatitude = " + destinationLatitude);
		console.log("locSuccess: destinationLongitude = " + destinationLongitude);
		console.log("googleMaps.live.click: this is where we show the map");
		//location.href = "https://maps.google.com/?q=loc:35.4607+-82.3681";
		var temphref = "https://maps.google.com/?q=loc:" + 
			destinationLatitude + "+" + destinationLongitude +
			"+(" + destinationName + ")";
		console.log("googleMaps.live.click: temphref = " + temphref);
		location.href = temphref;
	});
	//navigator.geolocation.getCurrentPosition(locSuccess, locError);
	//console.log("googleMaps.live.click: returned from getCurrentPosition");
}); // end #googleMaps.live('click' ...)
