var BASE_URL = "https://api.syncano.io/v1/instances/weathered-river-7002/webhooks/p/e3f72fc463d20d5dd1a173efc6e8a74ae44a977e/";

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
		{keyWord:'snow', wi: 'wi wi-day-snow'}
	];
	for (var i = 0; i < keyWords.length; i++) {
		var regex = new RegExp(keyWords[i].keyWord, 'i');
		if (description.match(regex)) {
			$(element).removeClass().addClass(keyWords[i].wi);
			break;
		} else {
			$(element).removeClass().addClass(keyWords[2].wi);
		}
	}
}

$( ".waves-effect.waves-teal.btn-flat" ).click(function() {
	city = '?city=' + $( '#city' ).val().split(' ').join('%20');
	state = '&state=' + $( '#state' ).val();

	var fetchData = new XMLHttpRequest();
	// var url = "https://api.syncano.io/v1/instances/weathered-river-7002/webhooks/p/e3f72fc463d20d5dd1a173efc6e8a74ae44a977e/?city=New%20york&state=ny";
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

			console.log(data);

			// $neWbox.find('h2').text("New York");
			// Set weather box data
			$neWbox.find('h2').text($( '#city' ).val());
			$neWbox.find('.wTemperature').text(today.current_temp_fahrenheit);			
			$neWbox.find('.wDay').text(Object.keys(data[0])[0]);

			$($neWbox.find('.dayName')[0]).text(Object.keys(data[1])[0]);
			$($neWbox.find('.dayName')[1]).text(Object.keys(data[2])[0]);
			$($neWbox.find('.dayName')[2]).text(Object.keys(data[3])[0]);

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
});
//https://api.syncano.io/v1/instances/weathered-river-7002/webhooks/p/3f8f8ed5f96a083e0655b937816b346d43efc411/?city=Tampa&state=FL