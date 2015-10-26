// CLIENT-SIDE JAVASCRIPT
// On page load
$(document).ready(function(){
  console.log('Hey, Earth!');

  // make all fields in sign up and log in forms required
  $("#sign-up-form").validate();
  $("#log-in-form").validate();


  // on submission of sign up form
	$("#sign-up-form").on('submit', function(e){
		e.preventDefault();
		console.log($(this).serialize());
		formData = $(this).serialize();

		// post route to server
		$.ajax ({
			url: '/api/users',
			type: 'POST',
			data: formData
		})
		.done(function(data){
			console.log("sign-up form posted to server");
			// if successful, send user to /homepage
			window.location.href = '/homepage';
		})
		.fail(function(data){
			console.log("sign-up form failed to post to server");
		});
	});
	// end of submission of sign up form


  // on submission of log in form
	$("#log-in-form").on('submit', function(e){
		e.preventDefault();
		console.log($(this).serialize());
		formData = $(this).serialize();

		// post route to server
		$.ajax ({
			url: '/login',
			type: 'POST',
			data: formData
		})
		.done(function(data){
			console.log("log-in form posted to server");
			console.log(data);
			// if successful, send user to /homepage
			if (data.firstName) {
				window.location.href = '/homepage';
			}
			else {
				$("#logInPassword").val("");
				$('#alertDiv').append('<div class="alert alert-danger log-in-alert" role="alert">Oops! Your email or password is incorrect. Try again. </div>');
				$('.log-in-alert').alert();
				window.setTimeout(function() {
					$('.log-in-alert').alert('close');
				}, 2000);
			}
		})
		.fail(function(data){
			console.log("log-in form failed to post to server");
		});
	});
	// end of submission of log in form


	// on click of log out button
	$('#log-out-btn').on('click', function(e){
		e.preventDefault();

		// post route to server
		$.ajax({
			url: '/logout',
			type: 'POST'
		})
		.done(function(data){
			console.log("log-out form posted to server");
			// if successful, redirect to index
			window.location.href = '/';
		})
		.fail(function(data){
			console.log("log-out form failed to post to server");
		});
	});
	// end of log out click


	// on click of addToListBtn
	$(document).on('click', '.addToListBtn', function(e){
		e.preventDefault();
		relevantListItem = $(this).parent().data();
		console.log(relevantListItem);
		relevantBtn = $(this);
		console.log(relevantBtn.parent());

		// post route to server to create book
		$.ajax({
			url: '/api/bookslist',
			type: 'POST',
			data: relevantListItem
		})
		.done(function(data){
			console.log("addToListBtn click posted to server");
			$(relevantBtn).popover('show');
			setTimeout(function() {
				$(relevantBtn).popover('hide');
			}, 3000);
		})
		.fail(function(data){
			console.log("addToListBtn click failed to post to server");
		});
	});


	// on click of readEnjoyedBtn
	$(document).on('click', '.readEnjoyedBtn', function(e){
		e.preventDefault();
		relevantListItem = $(this).parent().data();
		console.log(relevantListItem);
		relevantBtn = $(this);

		// post route to server to create book
		$.ajax({
			url: '/api/booksreadenjoyed',
			type: 'POST',
			data: relevantListItem
		})
		.done(function(data){
			console.log("readEnjoyedBtn click posted to server");
			$(relevantBtn).popover('show');
			setTimeout(function() {
				$(relevantBtn).popover('hide');
			}, 2000);
		})
		.fail(function(data){
			console.log("readEnjoyedBtn click failed to post to server");
		});
	});


	// on click of readNotEnjoyedBtn
	$(document).on('click', '.readNotEnjoyedBtn', function(e){
		e.preventDefault();
		relevantListItem = $(this).parent().data();
		console.log(relevantListItem);
		relevantBtn = $(this);

		// post route to server to create book
		$.ajax({
			url: '/api/booksreadnotenjoyed',
			type: 'POST',
			data: relevantListItem
		})
		.done(function(data){
			console.log("readNotEnjoyedBtn click posted to server");
			$(relevantBtn).popover('show');
			setTimeout(function() {
				$(relevantBtn).popover('hide');
			}, 2000);
		})
		.fail(function(data){
			console.log("readNotEnjoyedBtn click failed to post to server");
		});
	});


	// on submit of authorSearchForm
	$('#authorSearchForm').on('submit', function(e){
		e.preventDefault();

		// check search field not empty
		if($('#authorSearchInput').val().trim().length > 0) {
			// if not empty, get value from search field i.e. author name to search
			var authorName = $(this).serialize();
			console.log(authorName);
			// reset input field
			$('#authorSearchForm')[0].reset();
			// clear searchResultsList
			$('#searchResultsList').empty();
			// return focus to author first name
			$('#authorSearchInput').focus();
			// ajax get request from server
			$.ajax({
				url: '/api/authorsearch',
				type: 'POST',
				data: authorName
			})
			.done(function(data){
				console.log("authorSearchForm click posted to server");
				// console.log(data);
				// if a search result gets returned
				if (data.items) {
					// for each book in the array
					for (var i = 0; i < data.items.length - 1; i++) {
						// if there is a synopsis show that book
						if (data.items[i].volumeInfo.description) {
								$('#searchResultsList').append(dataIntoHTML(data.items[i]));
						}
					}
				}
				// if search return is empty
				else {
					$('#authorSearchForm').append('<div class="alert alert-danger" id="authorSearchAlert1" role="alert">It looks like there was an error finding that author. Please try again with a different name! </div>');
					$('#authorSearchAlert1').alert();
					window.setTimeout(function() {
						$('#authorSearchAlert1').alert('close');
					}, 3000);
				}
			})
			.fail(function(data){
				console.log("authorSearchForm click failed to post to server");
			});
		}
		else {
			$('#authorSearchForm').append('<div class="alert alert-danger" id="authorSearchAlert2" role="alert">Please enter the name of an author and try again. </div>');
			$('#authorSearchAlert2').alert();
			window.setTimeout(function() {
				$('#authorSearchAlert2').alert('close');
			}, 3000);
		}
	});


// on submit of bookSearchForm
$('#bookSearchForm').on('submit', function(e){
	e.preventDefault();

	// check search field not empty
	if($('#bookSearchInput').val().trim().length > 0) {
		// if not empty, get value from search field i.e. book name to search
		var bookName = $(this).serialize();
		console.log(bookName);
		// reset input field
		$('#bookSearchForm')[0].reset();
		// clear searchResultsList
		$('#searchResultsList').empty();
		// return focus to author first name
		$('#bookSearchInput').focus();
		// ajax get request from server
		$.ajax({
			url: '/api/booksearch',
			type: 'POST',
			data: bookName
		})
		.done(function(data){
			console.log("bookSearchForm click posted to server");
			// console.log(data);
			// if a search result gets returned
			if (data.items) {
				// for each book in the array
				for (var i = 0; i < data.items.length - 1; i++) {
					// if there is a synopsis show that book
					if (data.items[i].volumeInfo.description) {
							$('#searchResultsList').append(dataIntoHTML(data.items[i]));
					}
				}
			}
			// if search return is empty
			else {
				$('#bookSearchForm').append('<div class="alert alert-danger" id="bookSearchAlert1" role="alert">It looks like there was an error finding that book. Please try again with a different title! </div>');
				$('#bookSearchAlert1').alert();
				window.setTimeout(function() {
					$('#bookSearchAlert1').alert('close');
				}, 3000);
			}
		})
		.fail(function(data){
			console.log("bookSearchForm click failed to post to server");
		});
	}
	else {
		$('#bookSearchForm').append('<div class="alert alert-danger" id="bookSearchAlert2" role="alert">Please enter the name of a book and try again. </div>');
		$('#bookSearchAlert2').alert();
		window.setTimeout(function() {
			$('#bookSearchAlert2').alert('close');
		}, 3000);
	}
});



}); // end of doc ready


// FUNCTIONS
// dataIntoHTML function
function dataIntoHTML(query) {
	// if an image and an isbn
	if (query.volumeInfo.imageLinks && query.volumeInfo.industryIdentifiers) { 
		var image1 = '<img class="bookImages media-object" src="' + query.volumeInfo.imageLinks.smallThumbnail + '">'; 
		return '<div ' + 
			'class="media" ' +
			'data-title="' + query.volumeInfo.title + '" ' +
			'data-author="' + query.volumeInfo.authors[0] + '" ' +
			'data-synopsis="' + query.volumeInfo.description + '" ' +
			'data-image="' + query.volumeInfo.imageLinks.smallThumbnail + '" ' +
			'data-isbn="' + query.volumeInfo.industryIdentifiers[0].identifier + '" ' +
			'>' +
				'<div class="media-body">' +
					'<strong>' + query.volumeInfo.title + '</strong> by ' + query.volumeInfo.authors[0] +
					'<br>' +
					query.volumeInfo.description +
				'</div>' +
			'<div class="media-right">' +
				image1 +
			'</div>' +
			'<br>' +
			'<button type="button" class="btn btn-default btn-sm addToListBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="This book has been added to your To-read list!">Add to list</button>' +
			'<button type="button" class="btn btn-default btn-sm readEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you enjoyed this.">Read and enjoyed</button>' +
			'<button type="button" class="btn btn-default btn-sm readNotEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you did not enjoy this.">Read and did not enjoy</button>' +
			'<hr>';
	}
	// else if no image but an isbn
	else if (query.volumeInfo.imageLinks === false && query.volumeInfo.industryIdentifiers){
		return '<div ' + 
			'class="media" ' +
			'data-title="' + query.volumeInfo.title + '" ' +
			'data-author="' + query.volumeInfo.authors[0] + '" ' +
			'data-synopsis="' + query.volumeInfo.description + '" ' +
			'data-isbn="' + query.volumeInfo.industryIdentifiers[0].identifier + '" ' +
			'>' +
				'<div class="media-body">' +
					'<strong>' + query.volumeInfo.title + '</strong> by ' + query.volumeInfo.authors[0] +
					'<br>' +
					query.volumeInfo.description +
				'</div>' +
			'<div class="media-right">' +
			'</div>' +
			'<br>' +
			'<button type="button" class="btn btn-default btn-sm addToListBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="This book has been added to your To-read list!">Add to list</button>' +
			'<button type="button" class="btn btn-default btn-sm readEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you enjoyed this.">Read and enjoyed</button>' +
			'<button type="button" class="btn btn-default btn-sm readNotEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you did not enjoy this.">Read and did not enjoy</button>' +
			'<hr>';
		}
	// else if image but no isbn 
	else if (query.volumeInfo.imageLinks && query.volumeInfo.industryIdentifiers === false) {
		var image2 = '<img class="bookImages media-object" src="' + query.volumeInfo.imageLinks.smallThumbnail + '">'; 
		return '<div ' + 
			'class="media" ' +
			'data-title="' + query.volumeInfo.title + '" ' +
			'data-author="' + query.volumeInfo.authors[0] + '" ' +
			'data-synopsis="' + query.volumeInfo.description + '" ' +
			'data-image="' + query.volumeInfo.imageLinks.smallThumbnail + '" ' +
			'>' +
				'<div class="media-body">' +
					'<strong>' + query.volumeInfo.title + '</strong> by ' + query.volumeInfo.authors[0] +
					'<br>' +
					query.volumeInfo.description +
				'</div>' +
			'<div class="media-right">' +
			image2 +
			'</div>' +
			'<br>' +
			'<button type="button" class="btn btn-default btn-sm addToListBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="This book has been added to your To-read list!">Add to list</button>' +
			'<button type="button" class="btn btn-default btn-sm readEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you enjoyed this.">Read and enjoyed</button>' +
			'<button type="button" class="btn btn-default btn-sm readNotEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you did not enjoy this.">Read and did not enjoy</button>' +
			'<hr>';
		}
	// else if no image and no isbn
	else {
		return '<div ' + 
			'class="media" ' +
			'data-title="' + query.volumeInfo.title + '" ' +
			'data-author="' + query.volumeInfo.authors[0] + '" ' +
			'data-synopsis="' + query.volumeInfo.description + '" ' +
			'>' +
				'<div class="media-body">' +
					'<strong>' + query.volumeInfo.title + '</strong> by ' + query.volumeInfo.authors[0] +
					'<br>' +
					query.volumeInfo.description +
				'</div>' +
			'<div class="media-right">' +
			'</div>' +
			'<br>' +
			'<button type="button" class="btn btn-default btn-sm addToListBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="This book has been added to your To-read list!">Add to list</button>' +
			'<button type="button" class="btn btn-default btn-sm readEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you enjoyed this.">Read and enjoyed</button>' +
			'<button type="button" class="btn btn-default btn-sm readNotEnjoyedBtn" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Thank you for letting us know you did not enjoy this.">Read and did not enjoy</button>' +
			'<hr>';
	}
	
}


