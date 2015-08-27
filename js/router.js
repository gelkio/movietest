//Routes of the application
MoviesApp.Router.map(function() {
  this.resource('results', { path : '/' }, function(){
	this.resource('movies', {path:'/movies/:actorId'});
  });
});

MoviesApp.ResultsRoute = Ember.Route.extend({
  model: function(params){
    var url = MoviesApp.API_URL+'movie/now_playing?api_key='+MoviesApp.API_KEY;
    return Ember.$.getJSON(url).then(function(data) {
      return data.results;
    });
  }
});

MoviesApp.ResultsController = Ember.ArrayController.extend({
	content: [],
    actorsContent: [],
    moviesContent: [],
	text: '', //Search Text
	
	actorCurrentPage: 1,
	actorTotalPages: 0,
	actorPaginationClass: 'hidden',
    movieCurrentPage: 1,
	movieTotalPages: 0,
	moviePaginationClass: 'hidden',
	
	actorMessage: '',
	actorMessageClass: 'hidden',
    movieMessage: '',
	movieMessageClass: 'hidden',
    
    nowPlayingClass: 'show',
    resultClass: 'hidden',
	
	actions: {
      
	  searchActors: function(){
		var self = this;
		var text = self.get('text');
		var urlActors = MoviesApp.API_URL+'search/person?api_key='+MoviesApp.API_KEY+'&query='+text;
		var urlMovies = MoviesApp.API_URL+'search/movie?api_key='+MoviesApp.API_KEY+'&query='+text;
          
        self.set('nowPlayingClass', 'hidden');
        self.set('resultClass', 'show');
    
		self.set('actorMessageClass', 'hidden');
        self.set('movieMessageClass', 'hidden');
		
		if(text !== ""){
		  Ember.$.getJSON(urlActors).then(function(data) {
			self.set('currentPage', data.page);
		    self.set('actorTotalPages', data.total_pages);
			self.set('actorsContent', data.results);
			
			if(data.results.length > 0 ){
			  self.set('actorPaginationClass', 'show');
			}else{
			  self.set('actorPaginationClass', 'hidden');
			  self.set('actorMessageClass', 'show');
			  self.set('actorMessage', 'There are no actors with the name '+text+'!');
			}
		  });
          Ember.$.getJSON(urlMovies).then(function(data) {
			self.set('currentPage', data.page);
		    self.set('movieTotalPages', data.total_pages);
			self.set('moviesContent', data.results);
			
			if(data.results.length > 0 ){
			  self.set('moviePaginationClass', 'show');
			}else{
			  self.set('moviePaginationClass', 'hidden');
			  self.set('movieMessageClass', 'show');
			  self.set('movieMessage', 'There are no movies with the name '+text+'!');
			}
		  });
	    }else{
			self.set('actorsContent', []);
            self.set('moviesContent', []);
            self.set('actorPaginationClass', 'hidden');
			self.set('actorMessageClass', 'show');
			self.set('actorMessage', 'Please put any text to make a search!');	
		}
	  },
	  
	  actorPreviousPage: function(){
	    var self = this;
		var text = self.get('text');
		var currentPage = self.get('actorCurrentPage');
		
		if(currentPage > 1){
		  currentPage --;
		  var url = MoviesApp.API_URL+'search/person?api_key='+MoviesApp.API_KEY+'&query='+text+'&page='+currentPage;
		  Ember.$.getJSON(url).then(function(data) {
			self.set('actorCurrentPage', data.page);
		    self.set('actorsContent', data.results);
		  });
		}
	  },
	  
	  actorNextPage: function(){
	    var self = this;
		var text = self.get('text');
		var currentPage = self.get('actorCurrentPage');
		var actorTotalPages = self.get('actorTotalPages');
		
		if(currentPage < actorTotalPages){
		  currentPage ++;
		  var url = MoviesApp.API_URL+'search/person?api_key='+MoviesApp.API_KEY+'&query='+text+'&page='+currentPage;
		  Ember.$.getJSON(url).then(function(data) {
		    self.set('actorCurrentPage', data.page);
		    self.set('actorsContent', data.results);
		  });
		}
	  },
        
      moviePreviousPage: function(){
	    var self = this;
		var text = self.get('text');
		var currentPage = self.get('movieCurrentPage');
		
		if(currentPage > 1){
		  currentPage --;
		  var url = MoviesApp.API_URL+'search/movie?api_key='+MoviesApp.API_KEY+'&query='+text+'&page='+currentPage;
		  Ember.$.getJSON(url).then(function(data) {
			self.set('movieCurrentPage', data.page);
		    self.set('moviesContent', data.results);
		  });
		}
	  },
	  
	  movieNextPage: function(){
	    var self = this;
		var text = self.get('text');
		var currentPage = self.get('movieCurrentPage');
		var movieTotalPages = self.get('movieTotalPages');
		
		if(currentPage < movieTotalPages){
		  currentPage ++;
		  var url = MoviesApp.API_URL+'search/movie?api_key='+MoviesApp.API_KEY+'&query='+text+'&page='+currentPage;
		  Ember.$.getJSON(url).then(function(data) {
		    self.set('movieCurrentPage', data.page);
		    self.set('moviesContent', data.results);
		  });
		}
	  },
        
      actorsTab: function(){
        Ember.$("#actorsResultPanel").addClass('active');
        Ember.$("#moviesResultPanel").removeClass('active');
      },
        
      moviesTab: function(){
        Ember.$("#moviesResultPanel").addClass('active');
        Ember.$("#actorsResultPanel").removeClass('active');
      },
        
      showMovieDetail: function(id){
        Ember.$("#myModal").modal('show');
        var self = this;
        var url = MoviesApp.API_URL+'movie/'+id+'?api_key='+MoviesApp.API_KEY;
        Ember.$.getJSON(url).then(function(data) {
          Ember.$('#movieTitle').html("");
          Ember.$('#movieOverview').html("");
		  self.set('movieTitle', data.original_title);
		  self.set('movieOverview', data.overview);
          self.set('moviePoster', MoviesApp.IMAGES_URL+data.poster_path);
        });
      }
	}
});

MoviesApp.MoviesRoute = Ember.Route.extend({
  model: function(params){
    var self = this;
    
    var actorDetailUrl = MoviesApp.API_URL+'person/'+params.actorId+'?api_key='+MoviesApp.API_KEY;
    Ember.$.getJSON(actorDetailUrl).then(function(data) {
      Ember.$('#actorName').html(data.name);
      Ember.$('#actorBiography').html(data.biography);
      Ember.$('#actorPhoto').attr('src', MoviesApp.IMAGES_URL+data.profile_path);
    });  
      
    var url = MoviesApp.API_URL+'person/'+params.actorId+'/movie_credits?api_key='+MoviesApp.API_KEY;
    return Ember.$.getJSON(url).then(function(data) {
      return data.cast;
    });
    
  }
});

MoviesApp.MoviesController = Ember.ArrayController.extend({
  sortProperties: ['release_date'],
  sortAscending: false,
  actions: {
    showMovieDetail: function(id){
      Ember.$("#myModal").modal('show');
      var self = this;
      var url = MoviesApp.API_URL+'movie/'+id+'?api_key='+MoviesApp.API_KEY;
      Ember.$.getJSON(url).then(function(data) {
        Ember.$('#movieTitle').html(data.original_title);
        Ember.$('#movieOverview').html(data.overview);
        Ember.$('#moviePoster').attr('src', MoviesApp.IMAGES_URL+data.poster_path);
      });
    }
  }
});