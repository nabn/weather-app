var BASE_URL = "https://api.syncano.io/v1/instances/weathered-river-7002/webhooks/p/0493e2e0f68f33b2c56ca3865f7ca7ca64734982/";

function grabDayData(data, index) {
	return data[index][Object.keys(data[index])]
}

function setWeatherIcon(element, description) {
	var keyWords = [
		{keyWord:'mist', wi: 'wi wi-day-fog'},
		{keyWord:'fog', wi: 'wi wi-day-fog'},
		{keyWord:'clear', wi: 'wi wi-day-sunny'},
		{keyWord:'drizzle', wi: 'wi wi-day-sprinkle'},
		{keyWord:'rain', wi: 'wi wi-day-rain'},
		{keyWord:'thunderstorm', wi: 'wi wi-day-thunderstorm'},
		{keyWord:'snow', wi: 'wi wi-day-snow'},
		{keyWord:'cloud', wi: 'wi wi-day-cloudy'},
		{keyWord:'haze', wi: 'wi wi-day-haze'}
	];
	for (var i = 0; i < keyWords.length; i++) {
		var regex = new RegExp(keyWords[i].keyWord, 'i');
		if (description.match(regex)) {
			$(element).removeClass().addClass(keyWords[i].wi);
			break;
		} else {
			$(element).removeClass().addClass('wi-day-cloudy');
		}
	}
}

function addWBox() {
	var name = $( '#city' ).val();
	var city = '?city=' + name.split(' ').join('%20');
	var state = '&state=' + $( '#state' ).val();

	var fetchData = new XMLHttpRequest();
	var url = BASE_URL + city + state;
	
	// Setup GET Request to fetch weather data
	fetchData.open("GET", url, true);
	fetchData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	fetchData.onreadystatechange = function() {
		if(fetchData.readyState == 4 && fetchData.status == 200) {
		    var data = JSON.parse(JSON.parse(fetchData.responseText).result.stdout);
		    $neWbox = $( "#original" ).clone().appendTo( ".weatherWrapper" );
			$neWbox.removeAttr('id');
			
			$( '.exit' ).click(function() {
				$(this).parent().parent().fadeOut(function() {
					$(this).parent().parent().remove();
				}.bind());
			});

			var today = grabDayData(data, 0);
			var tomorrow = grabDayData(data, 1);
			var dayThree = grabDayData(data, 2);
			var dayFour = grabDayData(data, 3);

			// Set weather box data
			$neWbox.find('h2').text(name);
			$neWbox.find('.wTemperature').text(today.current_temp_fahrenheit);			
			$neWbox.find('.wDay').text(Object.keys(data[0])[0]);

			var tomorrowName = Object.keys(data[1])[0];
			var dayTreeName = Object.keys(data[2])[0];
			var dayFourName = Object.keys(data[3])[0];

			if ($(window).width() < 480) {
				$($neWbox.find('.dayName')[0]).text(tomorrowName.substring(0, 3));
				$($neWbox.find('.dayName')[1]).text(dayTreeName.substring(0, 3));
				$($neWbox.find('.dayName')[2]).text(dayFourName.substring(0, 3));
			} else {
				$($neWbox.find('.dayName')[0]).text(tomorrowName);
				$($neWbox.find('.dayName')[1]).text(dayTreeName);
				$($neWbox.find('.dayName')[2]).text(dayFourName);
			}

			$($neWbox.find('.wiMin')[0]).text(tomorrow.temp_min_average_fahrenheit);
			$($neWbox.find('.wiMin')[1]).text(dayThree.temp_min_average_fahrenheit);
			$($neWbox.find('.wiMin')[2]).text(dayFour.temp_min_average_fahrenheit);

			$($neWbox.find('.wiMax')[0]).text(tomorrow.temp_max_average_fahrenheit);
			$($neWbox.find('.wiMax')[1]).text(dayThree.temp_max_average_fahrenheit);
			$($neWbox.find('.wiMax')[2]).text(dayFour.temp_max_average_fahrenheit);

			$('<sup>°<span>F</span></sup>').appendTo($neWbox.find('.wiMin'));
			$('<sup>°<span>F</span></sup>').appendTo($neWbox.find('.wiMax'));
			$('<sup>°<span>F</span></sup>').appendTo($neWbox.find('.wTemperature'));

			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], today.more_descriptive_description);
			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], tomorrow.more_descriptive_description);
			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], dayThree.more_descriptive_description);
			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], dayFour.more_descriptive_description);

			$neWbox.fadeIn();
		}
	}
	fetchData.send();

	$( '#empty' ).fadeOut();

}

$(document).ready(function(){
	$( ".waves-effect.waves-teal.btn-flat" ).click(addWBox);
    $( "input" ).keypress(function(e){
      if(e.keyCode == 13)
	      addWBox();
    });
});

$(window).resize(function() {
	if ($(window).width() < 480) {
		var $dayNames = $( '.dayName' );
		for (var i = 0; i < $dayNames.length; i++) {
			$($dayNames[i]).text($($dayNames[i]).text().substring(0, 3));
		}
	}
});