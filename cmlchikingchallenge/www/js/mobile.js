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
