/*
Weather App Javascript | MIT License
This weather app fetches the weather data of a city and continually updates it
*/

// Setup
var scale = "F";
var BASE_URL = "ADD YOUR WEBHOOK HERE";
var syncano = new Syncano({
	apiKey: 'YOUR API KEY',
	instance: 'YOUR INSTANCE NAME'
});

//Map of conditions to weather icon class for matching
var condition = {
	mist: 'wi-day-sprinkle',
	fog: 'wi-day-fog',
	clear: 'wi-day-sunny',
	drizzle: 'wi-day-sprinkle',
	rain: 'wi-day-rain',
	thunderstorm: 'wi-day-thunderstorm',
	snow: 'wi-day-snow',
	cloud: 'wi-day-cloudy',
	haze: 'wi-day-haze'
};


//helper function to return correct weather icon
function getWeatherIcon(desc) {
	var keys = Object.keys(condition);

	for (var i = 0; i < keys.length; i++) {
		var r = new RegExp(keys[i], 'i');
		if (desc.match(r)) {
			return condition[keys[i]];
		}
	}

	return 'wi-day-cloudy';
};

//helper function to convert kelvin to ahrenheit
function kToF(k) {
	 return (Math.round(kToC(k) * 1.8000 + 32.00));
};

//helper function to convert kelvin to celcius
function kToC(k) {
	return (Math.round(k - 273.15));
};

//converts temp to proper scale depending on current setting of F or C
function convertTemp(k) {
	if (scale === "F") {
		return kToF(k);
	} else {
		return kToC(k);
	}
}

//click handler for the F/C toggle in the UI
function toggleScale() {
	scale = (scale === 'F') ? 'C' : 'F';

	$('#scale span').text(scale);
	var temps = $('*[data-temp]');
	//console.log(temps);
	for (var i = 0; i < temps.length; i++) {
		$t = $(temps[i]);
		//convert the temperature
		$t.get(0).childNodes[0].nodeValue = convertTemp($t.data("temp"));
		//change the scale text
		$t.find('span').text(scale);
	}
}


// Handlebar helpers

//take a temp in kelvin, and displays the proper temperature
Handlebars.registerHelper('displayTemp', function(k) {
  var out = convertTemp(k) + '<sup>°<span>' + scale + '</span></sup>';
  return new Handlebars.SafeString(out);
});

//takes the short description from the data result, and returns the proper class for the weather icon
Handlebars.registerHelper('displayIcon', function(desc) {
	var out = '<i class="wi ' + getWeatherIcon(desc) + '"></i>';
  return new Handlebars.SafeString(out);
});

//takes a string representation of utc time, and outouts the proper day, abbreviated to three letters
Handlebars.registerHelper('displayDay', function(t) {
	var day = new Date(t*1000);
  return new Handlebars.SafeString(day.toDateString().substring(0, 3));
});

//compile handlebar templates first
var wBoxTemplate = Handlebars.compile($('#wBox-template').html());


//This is where all of the real time action happens with Syncano.
function sync(id) {
	console.log('syncing');
	var realtime =  syncano.channel("weather_realtime").watch({room: id});

	realtime.on('update', function(res){
		var city = $('span[data-cityid="' + id + '"]');
		if (res.current_temp) {
			var cTemp = $(city.find('.wTemperature'));
			cTemp.attr('data-temp', res.current_temp);
			cTemp.get(0).childNodes[0].nodeValue = convertTemp(res.current_temp);
		}
		if (res.short_description) {
			var cIcon = $(city.find('.wIcon i'));
			console.log(cIcon);
			cIcon.removeClass();
			cIcon.addClass('wi ' + getWeatherIcon(res.short_description));
		}
	});

}

// Creates a weather box whenever the 'Add' button is pressed.
function addWBox() {
	var name = $( '#city' ).val();
	var city = '?city=' + name.split(' ').join('%20');
	var state = '&state=' + $( '#state' ).val();
	var url = BASE_URL + city + state;

	$.get(url, function(data){
		var data = JSON.parse(data.result.stdout);
		var obj = {name: name, cityId: data[0].city_id, currentTemp: data.shift(), temps: data.slice(0,3)};
		$newBox = $('<div/>').html(wBoxTemplate(obj));
		$newBox.appendTo( ".weatherWrapper" );
		sync(obj.cityId);
	});

	$( '#empty' ).hide();

};

// Set onClick handler for button and Enter Key for text boxes
$(document).ready(function(){
	$( ".waves-effect.waves-teal.btn-flat" ).click(addWBox);
	$( "input" ).keypress(function(e) {
		if (e.keyCode == 13)
			addWBox();
    });

	$( "#scale" ).click(toggleScale);

	$( document ).on('click', '.exit', function() {
		$(this).parent().parent().fadeOut(function(){
			$(this).remove();
		})
	});

});
