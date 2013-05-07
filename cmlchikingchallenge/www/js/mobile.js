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
	var trailDirectionsHTML;
	$.getJSON("trails.json", trailhead, function (data) {
		globals.setTrailId(trailhead);
		trailDirectionsHTML = "<div class='myfigure-and-description'>";
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
		localStorage.setItem("trailDirectionsHTML", trailDirectionsHTML);
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
	localStorage.setItem("newTrail", Number(1));
	buildTrailSelectionList();
	// console.log("Leaving selectPage pageinit");
});

/*
 * # t r a i l D i r e c t i o n s P a g e - p a g e s h o w
 */
$('#trailDirectionsPage').live("pageshow", function() {
	'use strict';
	// console.log("Entering trailDirectionsPage.pageshow.function");
	var trailhead = globals.getTrailId();
	var myNewTrail = localStorage.getItem("newTrail");
	var myTrailDirectionsHTML;
	if (myNewTrail > 0) {
		localStorage.setItem("newTrail", Number(0));
		buildTrailDirectionsPage(trailhead);
	} else {
		myTrailDirectionsHTML = localStorage.getItem("trailDirectionsHTML");
		$('#trailDirectionsPageCONTENT').html(myTrailDirectionsHTML);

	}
	// console.log("Leaving trailDirectionsPage.pageshow");
}); // end #trailDirectionsPage.live("pageshow" ...

/*
 * t r a i l L i n k C l i c k e d
 */
function trailLinkClicked(trailId) {
	// console.log("trailLinkClicked: trailId is " + trailId);
	globals.setTrailId(trailId);
	$.mobile.changePage($('#trailDirectionsPage'), {});
} // end linkClickedlistingNumber

/*
 * # g o o g l e M a p s - c l i c k
 */
$('#googleMaps').live('click', function() {
	var myTrailId = globals.getTrailId(),
		destinationLatitude,
		destinationLongitude;
	alert("Android users navigating with Google Maps may use their " +
			"device's Back button to view the trail directions.  " +
			"Browser users may use their browser's Back arrow.");
	$.getJSON("trails.json", function(data) {
		destinationLatitude = data.trails[myTrailId].latitude;
		destinationLongitude = data.trails[myTrailId].longitude;
		destinationName = data.trails[myTrailId].name;
		location.href = "https://maps.google.com/?q=loc:" + 
			destinationLatitude + "+" + destinationLongitude +
			"+(" + destinationName + ")";
	});
}); // end #googleMaps.live('click' ...)
