//Routes of the application
MoviesApp.Router.map(function() {
  this.resource('results', { path : '/' }, function(){
	this.resource('movies', {path:'/movies/:actorId'});
  });
});

MoviesApp.ResultsController = Ember.ArrayController.extend({
	content: [],
	text: '', //Search Text
	
	currentPage: 0,
	totalPages: 0,
	paginationClass: 'hidden',
	
	message: '',
	messageClass: 'hidden',
	
	actions: {
      
	  searchActors: function(){
		var self = this;
		var text = self.get('text');
		var url = MoviesApp.API_URL+'search/person?api_key='+MoviesApp.API_KEY+'&query='+text;
		
		self.set('messageClass', 'hidden');
		
		if(text != ""){
		  Ember.$.getJSON(url).then(function(data) {
			self.set('currentPage', data.page);
		    self.set('totalPages', data.total_pages);
			self.set('content', data.results);
			
			if(data.results.length > 0 ){
			  self.set('paginationClass', 'show');
			}else{
			  self.set('paginationClass', 'hidden');
			  self.set('messageClass', 'show');
			  self.set('message', 'There are no actors with the name '+text+'!');
			}
		  });
	    }else{
			self.set('content', []);
            self.set('paginationClass', 'hidden');
			self.set('messageClass', 'show');
			self.set('message', 'Please put any text to make a search!');	
		}
	  },
	  
	  previousPage: function(){
	    var self = this;
		var text = self.get('text');
		var currentPage = self.get('currentPage');
		
		if(currentPage > 1){
		  currentPage --;
		  var url = MoviesApp.API_URL+'search/person?api_key='+MoviesApp.API_KEY+'&query='+text+'&page='+currentPage;
		  Ember.$.getJSON(url).then(function(data) {
			self.set('currentPage', data.page);
		    self.set('content', data.results);
		  });
		}
	  },
	  
	  nextPage: function(){
	    var self = this;
		var text = self.get('text');
		var currentPage = self.get('currentPage');
		var totalPages = self.get('totalPages');
		
		if(currentPage < totalPages){
		  currentPage ++;
		  var url = MoviesApp.API_URL+'search/person?api_key='+MoviesApp.API_KEY+'&query='+text+'&page='+currentPage;
		  Ember.$.getJSON(url).then(function(data) {
		    self.set('currentPage', data.page);
		    self.set('content', data.results);
		  });
		}
	  }
	}
});

MoviesApp.MoviesRoute = Ember.Route.extend({
  model: function(params){
    var url = MoviesApp.API_URL+'person/'+params.actorId+'/movie_credits?api_key='+MoviesApp.API_KEY;
    return Ember.$.getJSON(url).then(function(data) {
      return data.cast;
    });
  }
});

MoviesApp.MoviesController = Ember.ArrayController.extend({
  sortProperties: ['release_date'],
  sortAscending: false,
});