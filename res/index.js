function average(a, b) {
	return (a + b)/2;
}

$( '.exit' ).click(function() {
	$(this).parent().parent().remove();
});

$( ".waves-effect.waves-teal.btn-flat" ).click(function() {
	var fetchData = new XMLHttpRequest();
	var url = "https://api.syncano.io/v1/instances/weathered-river-7002/webhooks/p/3f8f8ed5f96a083e0655b937816b346d43efc411/?city=Tampa&state=FL";
	// var params = ("api_key=73e8719c66b633aea9a28f554b6d93428ef360d1&project_id=5927&collection_id=18457&title=data&text=" + document.getElementById("text").value);
	fetchData.open("GET", url, true);
	fetchData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	fetchData.onreadystatechange = function() {//Call a function when the state changes.
		if(fetchData.readyState == 4 && fetchData.status == 200) {
		    var data = JSON.parse(JSON.parse(fetchData.responseText).result.stdout);
		    console.log(data);
		    $neWbox = $( "#original" ).clone().appendTo( ".weatherWrapper" );
			$neWbox.removeAttr('id');
			
			$( '.exit' ).click(function() {
				$(this).parent().parent().remove();
			});

			console.log(data[0][Object.keys(data[0])].current_temp_fahrenheit);



			$neWbox.find('h2').text("New York");
			$neWbox.find('.wTemperature').text(data[0][Object.keys(data[0])].current_temp_fahrenheit);
			$('<sup>°<span>F</span></sup>').appendTo($neWbox.find('.wTemperature'));

			$neWbox.fadeIn();
		} else {
			console.log(fetchData.responseText);
		}
	}
	fetchData.send();
});
//https://api.syncano.io/v1/instances/weathered-river-7002/webhooks/p/3f8f8ed5f96a083e0655b937816b346d43efc411/?city=Tampa&state=FL