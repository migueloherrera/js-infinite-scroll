var title;
var pageNumber;
var results;
var counter;

function callAjax(title, page) {
	$.ajax({
    	url: "http://www.omdbapi.com/?s=" + title + "&type=movie&r=json&page=" + page + "",
    	type: "GET",
     	dataType : "json",
      beforeSend: function(){
        $(".loading").fadeIn();
      },
    	success: function(json) {

			  if (json.Response == "False") {
			    if (page == 1) {
        	  $('#content').append('<p>Sorry!... No movies found.</p>');
        	}
			  } else {
			    if (page == 1) {
    			  results = parseInt(json.totalResults);
    			}
			    for (var i = 0; i < json.Search.length; i++) {
			      searchMovie(json.Search[i].imdbID);
			    }
			  }
    	},
    	error: function() {
  	    console.log("An error has ocurred!");
    	},
     	complete: function() {
     	  $(".loading").fadeOut();
    	  console.log( "The request is complete!" );
    	}
	});
};

function searchMovie(id) {
	$.ajax({
    	url: "http://www.omdbapi.com/?i=" + id + "&plot=short&r=json",
    	type: "GET",
     	dataType : "json",
      beforeSend: function(){
        $(".loading").fadeIn();
      }, 
    	success: function(json) {

			  if (json.Response == "False") {
      	  var response = '<p>Incorrect movie ID</p>';
			  } else {
			    addMovie(json);
			  }
    	},
    	error: function() {
  	    console.log("An error has ocurred!");
    	},
     	complete: function() {
    	  console.log( "The movie request is complete!" );
    	  $(".loading").fadeOut();
    	}
	});
};

function addMovie(info) {
  counter++;
  var img = (info.Poster == "N/A") ? "image_not_available.jpg" : info.Poster;
  var movie = "<div class='movie clearfix'>" +
              "<h2>" + counter + ". " + info.Title + "</h2>" +
              "<img src='" + img + "' />" + 
              "<div class='field'>Genre: <span>" + info.Genre + "</span></div>" +
              "<div class='field'>Year: <span>" + info.Year + "</span></div>" +
              "<div class='field'>Duration: <span>" + info.Runtime + "</span></div>" +
              "<div class='field'>Plot: <span>" + info.Plot + "</span></div>" +
              "<div class='field'>Language: <span>" + info.Language + "</span></div>" +
              "<div class='field'>Rating: <span>" + info.imdbRating + "</span></div>" +
              "</div>"
  $('#content').append(movie);
}

function scrolling(element){
	var docTop = $(window).scrollTop();
	var docBottom = docTop + $(window).height();

	var elemTop = $(element).offset().top;
	var elemBottom = elemTop + $(element).height();

	return ((elemBottom <= docBottom) && (elemTop >= docTop));
}

$(document).ready(function(){

  $('#moviesearch').submit(function(){
	  $('#content').empty();
	  pageNumber = 1;
	  title = document.getElementById('movietitle').value;
	  counter = 0;
	  //$('#movietitle').val();
	  callAjax(title, pageNumber);
	  return false;
  });
  
  $(document).scroll(function(){
		if (scrolling(".movie:last-child")) {
		  pageNumber++;
		  if (counter < results && pageNumber <= 10) {
			  callAjax(title, pageNumber);
			}
		}
  });
  
});
