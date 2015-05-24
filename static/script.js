$(document).ready(mainbox);

$(function() {
	$('#notes').bind('click',mainbox);
})

function mainbox(){
	$('#label').text('')
	$('#label').html("szukaj po tagu: <input type=text maxlenght=10 name='tag_tf'><button href=# id='tag_btn'type='button'>szukaj</button>" +
		"   szukaj po kategorii:" +
		"<select name='category_select' id='category_select'>" +
		"<option value=''></option>" +  
		"<option value='Kawał'>Kawał</option>" +   
		"<option value='Info'>Info</option>" +
		"<option value='Inne'>Inne</option>" +
		"<option value='Cytaty'>Cytat</option>" +
		"</select>" +
		"<button href=# id='category_btn' type='button'>szukaj</button></p>" +
		"<button href=# id='reset_btn' type='button'>reset</button></p>");

	$('#section').text('')
	$.getJSON($SCRIPT_ROOT +  '/mainbox', function(data){
		$.each(data.result, function(i, elem){	
			var title, tag, category, id;
			category = elem.category;
			tag = elem.tag;
			title = elem.title;
			id = elem.id;
			$('#section').append("<div class='subsection'>" +
				"<div class='note' id='" + id + "' href=#> " +
				"<a class='title'> " + title + " </a>" +
				"<a class='tag'> tag: " + tag + " </a>" +
				"<a class='category'> kategoria:" + category + " </a>" +
				"</div>" +
				"<a class='edit' href=# id='" + id + "'> Edytuj </a>" +
				"<a class='delete' href=# id='" + id + "'> Usuń </a>" + 
				"</div>" 
				);
		});
	});
};

$(function(){
	$('body').on('click', '.delete', function() {
		$.getJSON($SCRIPT_ROOT + '/delete_note', {
			note_id: $(this).attr('id')
		}, function(data) {
			$('#label').append("<p id='error_msg'>" +  data.result + "</p>");
			$('#error_msg').show().delay(2200).fadeOut();
			setTimeout(function() {
				$('#error_msg').remove();
				mainbox();
			},2202);
		});
	});
	return false;		
});

$(function(){
	$('body').on('click', '.delete', function(){
		mainbox();
	});
})

$(function(){
	$('body').on('click','.edit', function() {
		var category, tag, id, title, content;
		$.getJSON($SCRIPT_ROOT + '/show_note', {
			note_id: $(this).attr('id')
		}, function(data){
			category = data.result['category'];
			tag = data.result['tag'];
			content = data.result['description'];
			id = data.result['id'];
			title = data.result['title'];

			$('#label').text('Edytuj notatkę');
			$('#section').text('');
			//metoda PUT nie działa na serwerze
			$("#section").append("<form action='/~parzysm1/apps/client1/note/"+id+"' method='POST'>" +
				"<fieldset>" +
				"<label> Tytuł: </label>" +
				"<input type=text id='title' name='title' value="+title+" maxlenght=20 required>" + 
				"<label>Tag</label>" +
				"<input type=text id='tag' name='tag' value="+tag+" maxlenght=10>" +
				"<label>Kategoria    </label>" +
				"<select name='category' id='category' required>" +
				"<option value='brak'></option>  <option value='Kawał'>Kawał</option>    <option value='Info'>Info</option>" +
				"<option value='Inne'>Inne</option>    <option value='Cytaty'>Cytat</option>" +
				"</select>" +
				"<label>Treść:</label>" +
				"<textarea id='content' name='content' cols=50 rows=8 required>"+content+" </textarea>" +
				"<button type='submit' disable value='Wyślij'>Wyślij</button>" +
				"</fieldset>" +
				"</form>");
		});

	});
return false;		
});

$(function() {
	$('body').on('click', '.note', show_note);
});

$(function() {
	$('body').on('click', '.content', show_note);
});

function show_note(){
//$('#section').text('');
	$.getJSON($SCRIPT_ROOT + '/show_note', {
		note_id: $(this).attr('id')
	}, function(data){
		console.log($('#' + data.note_id).lenght);
		if($('#' + data.note_id).next().next().next().attr('class') == null)
			$('#' + data.note_id).parent().append("<div class='content'>" + data.result['description'] + "</div>");
		else 
			$('#' + data.note_id).next().next().next().remove();
	});
return false;	
};

$(function() {
	$('#new_note').on('click', function() {
		$('#label').text('Nowa notatka');
		$('#section').text('')
		$("#section").append("<form action='/~parzysm1/apps/client1/new_note' method='POST'>" +
			"<fieldset>" +
			"<label> Tytuł: </label>" +
			"<input type=text id='title' name='title' maxlenght=20 required>" + 
			"<label>Tag</label>" +
			"<input type=text id='tag' name='tag' maxlenght=10>" +
			"<label>Kategoria    </label>" +
			"<select name='category' id='category' required>" +
			"<option value='brak'></option>  <option value='Kawał'>Kawał</option>    <option value='Info'>Info</option>" +
			"<option value='Inne'>Inne</option>    <option value='Cytaty'>Cytat</option>" +
			"</select>" +
			"<label>Treść:</label>" +
			"<textarea id='content' name='content'  cols=50 rows=8 required></textarea>" +
			"<button type='submit' value='Wyślij'>Wyślij</button>" +
			"</fieldset>" +
			"</form>");
		console.log("fffffffffffffffffffffffff")
	});
	$('#section').text('');
	return false;
});


$(function() {
	$('#category_btn').on('click', function(){
		console.log("category")
		var note = $('#category_select').find(":selected").text()

		$('#section').text('')
		console.log(note)
		$.getJSON($SCRIPT_ROOT + '/category', {
			note_category: note
		}, function(data){
			$.each(data.result, function(i, elem){	
				var title, tag, category, id;
				category = elem.category;
				tag = elem.tag;
				title = elem.title;
				id = elem.id;
				$('#section').append("<div class='subsection'>" +
					"<div class='note' id='" + id + "' href=#> " +
					"<a class='title'> " + title + " </a>" +
					"<a class='tag'> " + tag + " </a>" +
					"<a class='category'> " + category + " </a>" +
					"</div>" +
					"<a class='delete' href=# id='" + id + "'> Usuń </a>" + 
					"</div>" 
					);
			});
		});
		return false;
	})
});

$(function() {
	$('#tag_btn').on('click', function(){
			console.log("tag");
			var ntag = $('input[name="tag_tf"]').val();

			$('#section').text('');
			console.log(ntag);
			$.getJSON($SCRIPT_ROOT + '/tag', {
				note_tag: ntag
			}, function(data){
				$.each(data.result, function(i, elem){	
					var title, tag, category, id;
					category = elem.category;
					tag = elem.tag;
					title = elem.title;
					id = elem.id;
					$('#section').append("<div class='subsection'>" +
						"<div class='note' id='" + id + "' href=#> " +
						"<a class='title'> " + title + " </a>" +
						"<a class='tag'> " + tag + " </a>" +
						"<a class='category'> " + category + " </a>" +
						"</div>" +
						"<a class='delete' href=# id='" + id + "'> Usuń </a>" + 
						"</div>" 
						);
				});
			});
			return false;
		});
});