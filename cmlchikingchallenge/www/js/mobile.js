/*
  CMLC Hiking Challenge
  Bob Cannon, July 2012
 */

/*global $, localStorage, console, navigator, alert, window, google, document */

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
				trailInfo.name +
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
 * i n i t i a l i z e M a p A n d C a l c u l a t e R o u t e
 */
/*function initializeMapAndCalculateRoute(lat, lon) {
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
*/
/*
 * l o c E r r o r
 */
/*function locError(error) {
	'use strict';
	// the current position could not be located
	alert("Couldn't get your position -- is geolocation enabled?");
	$.mobile.changePage($('#homePage'), {});
} // end locError
*/
/*
 * l o c S u c c e s s
 */
/*function locSuccess(position) {
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

	*//****
	globals.setLatitude(position.coords.latitude);
	console.log("locSuccess: returned from setLatitude");
	globals.setLongitude(position.coords.longitude);
	console.log("locSuccess: returned from setLongitude");
	****//*
	*//***
	initializeMapAndCalculateRoute(position.coords.latitude,
			position.coords.longitude);
	*****//*
	// console.log("Leaving locSucess");
} // end locSuccess
*/
/*
 * i n s e r t D i s t a n c e
 */
/*function insertDistance(stepNum) {
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
*/
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
/*$("#mapPage").live("pageinit", function() {
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
*/
/*
 * # m a p P a g e -- p a g e s h o w
 */
/*$("#mapPage").live("pageshow", function() {
	'use strict';
	// find current position -- if success initialize map and calculate route
	// console.log("Entering mapPage.live.pageshow");
	navigator.geolocation.getCurrentPosition(locSuccess, locError);
	// console.log("Leaving mapPage.live.pageshow");
}); // end #mappage.live.pageshow ...
*/
/*
 * . r e f r e s h -- c l i c k
 */
/*$('.refresh').live("click", function() {
	'use strict';
	//console.log("Entering .refresh.live.click");
	$('#mapCanvas').show();
	$.mobile.changePage($('#mapPage'), {});
	//console.log("Leaving .refresh.live.click");
}); // end .refresh.live("click" ...
*/
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
