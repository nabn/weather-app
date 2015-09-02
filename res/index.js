/*
Weather App Javascript | MIT License
This weather app fetches the weather data of a city and continually updates it
*/

// Setup
var scale = "°F";
var BASE_URL = "https://api.syncano.io/v1/instances/weathered-river-7002/webhooks/p/caa268830ac628542178f811fbf898df34b3fefe/";
var syncano = new Syncano({
	apiKey: '04c08cbd87c316b883463452d86562c4789f027b',
	instance: "weathered-river-7002"
});

// Functions
function grabDayData(data, index) {
	// Returns the data of a single day that's stored in the JSON Response 
	return data[index][Object.keys(data[index])]
}

function setWeatherIcon(element, description) {
	// Parses the weather description and sets the proper weather icon
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

function watch(lastId, room, $weatherBox) {
	// Creates a Syncano channel and checks for updates.
	// If there is an update, it will update the temperature and/or weather icon if necessary
	syncano.channel("weather_realtime").poll({lastId: lastId, room: room})
	.then(function(res) {
		if (res !== undefined) {
			lastId = res.id;
			console.log(res);
			var data = res.payload;
			if (data.current_temp_fahrenheit) {
				var temp = data.current_temp_fahrenheit;
				if (scale === '°C') {
					temp = Math.round((temp - 32) * 5 / 9);
				}
				$weatherBox.find('.wTemperature').text(temp);
				$('<sup>'+scale+'</sup>').appendTo($weatherBox.find('.wTemperature'));
			}
			if (data.more_descriptive_description)
				setWeatherIcon($weatherBox.find('.wi')[0], dayOne.more_descriptive_description);
		}
		watch(lastId, room, $weatherBox);
	})
	.catch(function(err) {
		console.log(err);
		watch(lastId, room, $weatherBox);
	});
}

function addWBox() {
	// Creates a weather box whenever the 'Add' button is pressed.
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

			console.log(data);
			
			$( '.exit' ).click(function() {
				$(this).parent().parent().fadeOut(function() {
					$(this).parent().parent().remove();
				}.bind());
			});

			var dayOne = data[0];
			var dayTwo = data[1];
			var dayThree = data[2];
			var dayFour = data[3];

			// Set weather box data
			$neWbox.find('h2').text(name);

			var dayOneName = new Date(dayOne.utc*1000);
			var dayTwoName = new Date(dayTwo.utc*1000);
			var dayThreeName = new Date(dayThree.utc*1000);
			var dayFourName = new Date(dayFour.utc*1000);

			$neWbox.find('.wDay').text(dayOneName.toDateString().substring(0, 3));

			var dayTwoName = dayTwoName.toDateString().substring(0, 3);
			var dayThreeName = dayThreeName.toDateString().substring(0, 3);
			var dayFourName = dayFourName.toDateString().substring(0, 3);

			$($neWbox.find('.dayName')[0]).text(dayTwoName);
			$($neWbox.find('.dayName')[1]).text(dayThreeName);
			$($neWbox.find('.dayName')[2]).text(dayFourName);

			var low = 'fahrenheit_low';
			var high = 'fahrenheit_high';
			var curr = 'current_temp_fahrenheit';
			if (scale === '°C') {
				low = 'celsius_low';
				high = 'celsius_high';
				curr = 'current_temp_celsius';
			}

			$neWbox.find('.wTemperature').text(dayOne[curr]);

			$($neWbox.find('.wiMin')[0]).text(dayTwo[low]);
			$($neWbox.find('.wiMin')[1]).text(dayThree[low]);
			$($neWbox.find('.wiMin')[2]).text(dayFour[low]);

			$($neWbox.find('.wiMax')[0]).text(dayTwo[high]);
			$($neWbox.find('.wiMax')[1]).text(dayThree[high]);
			$($neWbox.find('.wiMax')[2]).text(dayFour[high]);

			$('<sup>'+scale+'</sup>').appendTo($neWbox.find('.wiMin'));
			$('<sup>'+scale+'</sup>').appendTo($neWbox.find('.wiMax'));
			$('<sup>'+scale+'</sup>').appendTo($neWbox.find('.wTemperature'));

			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], dayOne.long_description);
			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], dayTwo.long_description);
			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], dayThree.long_description);
			setWeatherIcon($neWbox.find('.wi.wi-alien')[0], dayFour.long_description);

			$neWbox.fadeIn();

			watch(undefined, dayOne.city_id, $neWbox);
		}
	}
	fetchData.send();

	$( '#empty' ).fadeOut();

}

function cToF(string) {
	return Math.round(Number(string.replace('°C','')) * 9 / 5 + 32);
}

function fToC(string) {
	return Math.round((Number(string.replace('°F','')) - 32) * 5 / 9);
}

function toggleScale() {
	if (scale === '°F') {
		scale = '°C';
		$('#scale').text('°C');
	} else {
		scale = '°F';
		$('#scale').text('°F');
	}

	var temps = $('.wTemperature, .wiMax, .wiMin');
	temps.splice(0,7); //removes the original weatherBox elements from array
	for (var i = 0; i < temps.length; i++) {
		temps[i] = $(temps[i]);
		if (scale === '°F' && temps[i].text().indexOf('C') > -1) {
			temps[i].text(cToF(temps[i].text()));
		} else if (scale === '°C' && temps[i].text().indexOf('F') > -1) {
			temps[i].text(fToC(temps[i].text()));
		}
		$('<sup>'+scale+'</sup>').appendTo(temps[i]);
	}


	
}

// Set onClick handler for button and Enter Key for text boxes
$(document).ready(function(){
	$( ".waves-effect.waves-teal.btn-flat" ).click(addWBox);
	$( "input" ).keypress(function(e) {
		if (e.keyCode == 13)
			addWBox();
    });
	$( "#scale" ).click(toggleScale);
});
