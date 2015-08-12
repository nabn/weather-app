$( '.exit' ).click(function() {
	$(this).parent().parent().remove();
});

$( ".waves-effect.waves-teal.btn-flat" ).click(function() {
	$neWbox = $( "#original" ).clone().appendTo( ".weatherWrapper" );
	$neWbox.removeAttr('id');
	

	$( '.exit' ).click(function() {
		$(this).parent().parent().remove();
	});

	$neWbox.find('h2').text("New York");
	$neWbox.find('.wTemperature').text("62");
	$neWbox.show();

});