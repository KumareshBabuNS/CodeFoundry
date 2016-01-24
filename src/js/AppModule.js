
var app = angular.module("CodeFoundry", ['ngRoute', 'ngMaterial', 'ngAnimate', 'ui.ace']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/posts', {
      	templateUrl: 'templates/posts.html',
        controller: 'postsController'
      })
      .when('/users/:id', {
      	templateUrl: 'templates/profile.html',
        controller: 'profileController'
      })
      .when('/', {
      	templateUrl: 'templates/home.html',
        controller: 'homeController'
      })
      .otherwise({
        redirectTo: '/'
      });
}]);

//defines application-wide constants
app.run(function($rootScope, MockUser, $location) {
	$rootScope.logoIcon = "assets/anvil.png";
	$rootScope.appName = "CodeFoundry";
	$rootScope.settingsOpen = false;

	$rootScope.profileOptions = [
		{name: "Profile", url: "#/users/" + MockUser.getId()},
		{name: "Your Likes", url: "#"},
		{name: "Log Out", url: "#"}
	];
	$rootScope.langOptions = [
		"Any Language",
		"JavaScript",
		"Java",
		"C",
		"C++",
		"Python",
		"Ruby",
		"PHP",
		"HTML",
		"CSS",
		"C#",
		"Objective-C",
		"Swift",
		"GoLang",
		"TCL",
		"R",
		"D"
	];

	$rootScope.typeOptions = [
		"Any",
		"Free",
		"Premium"
	];

	//default search settings 
	$rootScope.searchQuery = {
		searchString: "",
		searchType: "Any",
		searchLanguage: "JavaScript"
	}
});

app.controller('homeController', function($scope, $http, MockUser) {
	$scope.msg = "This is the home page, under construction.";
});

app.controller('profileController', function($scope, $http, MockUser) {
	$scope.msg = "Hello, World";
});	

app.controller('postsController', function($scope, $http, $rootScope, MockUser) {
	console.log($rootScope.searchQuery.searchString);
	$scope.apiPosts = [
		{
			_id: "A4XYT34Z2309VGRSHT56",
		    title: "JavaScript bubble sort",
		    author: {
		        username: "Vuk Petrovic", 
		        id: "abdsfsdv353y3gdvdb",
		        imageUrl: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/5/005/078/11a/206c973.jpg"
		    },
		    datePublished: "1-23-2016",
		    code: "function binaryIndexOf(searchElement) {\n" +
			    "'use strict';\n" +
			 
			    "var minIndex = 0;\n" +
			    "var maxIndex = this.length - 1;\n" +
			    "var currentIndex;\n" +
			    "var currentElement;\n" +
			 
			    "while (minIndex <= maxIndex) {\n" +
			        "currentIndex = (minIndex + maxIndex) / 2 | 0;\n" +
			        "currentElement = this[currentIndex];\n" +
			 
			        "if (currentElement < searchElement) {\n" +
			            "minIndex = currentIndex + 1;\n" +
			        "}"+
			        "else if (currentElement > searchElement) {\n"+
			            "maxIndex = currentIndex - 1;\n"+
			        "}\n"+
			        "else {\n"+
			            "return currentIndex;\n"+
			        "}\n"+
			    "}\n"+
			 
			    "return -1;\n"+
			"}\n",
		    description: "This is a function call that performs a bubble sort on the supplied data.",
		    lang: "JavaScript", 
		    rating: 15
	    },
	    {
			_id: "A4XefefT34Z2309VGRSHT56",
		    title: "JavaScript bubble sort",
		    author: {
		        username: "Ken Watson", 
		        id: "abdsfsdv353y3gdvdb",
		        imageUrl: "http://static4.businessinsider.com/image/4f7b908169bedda91400001c/10-things-you-should-never-say-to-a-front-end-web-developer.jpg"
		    },
		    datePublished: "1-23-2016",
		    code: "function binaryIndexOf(searchElement) {\n" +
			    "'use strict';\n" +
			 
			    "var minIndex = 0;\n" +
			    "var maxIndex = this.length - 1;\n" +
			    "var currentIndex;\n" +
			    "var currentElement;\n" +
			 
			    "while (minIndex <= maxIndex) {\n" +
			        "currentIndex = (minIndex + maxIndex) / 2 | 0;\n" +
			        "currentElement = this[currentIndex];\n" +
			 
			        "if (currentElement < searchElement) {\n" +
			            "minIndex = currentIndex + 1;\n" +
			        "}"+
			        "else if (currentElement > searchElement) {\n"+
			            "maxIndex = currentIndex - 1;\n"+
			        "}\n"+
			        "else {\n"+
			            "return currentIndex;\n"+
			        "}\n"+
			    "}\n"+
			 
			    "return -1;\n"+
			"}\n",
		    description: "This is a function call that performs a bubble sort on the supplied data.",
		    lang: "JavaScript", 
		    rating: 15
	    }
	]
	//$scope.eventSources = [];
	$scope.aceLoaded = function(idx, post) {
		var el = document.getElementById("editor" + idx);
		editor = ace.edit(el);
		editor.session.setValue(post.code);

	}

	$scope.updateLikeData = function(post) {
		//add the post id to the list of the currently logged in user's likes 
		if(MockUser.doesLike(post._id)) {
			MockUser.removeLike(post._id);
			post.rating--;
		} else {
			MockUser.addLike(post._id);
			post.rating++;
		}
	}
});

app.directive("apiPost", function() {
	return {
		templateUrl: 'partials/apiPost.html'
	}
});

/*we need not demonstrate fully functioning login features as it's not the core concept of our app, we'll fill in 
  these details with a mock user*/
app.factory("MockUser", function() {
	var user = {};

	user.id = "8346509f62h1";
	user.username = "Vuk_Pet_Wolf";
	user.password = "password"; //lol because it is such a common password for people appearantly 
	user.imageUrl = "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/5/005/078/11a/206c973.jpg";
	user.likes = [];
	user.posts = [];

	user.addLike = function(postId) {
		user.likes.push(postId);
	}

	user.removeLike = function(postId) {
		if(user.likes.indexOf(postId) != -1) {
			var idx = user.likes.indexOf(postId);
			user.likes.splice(idx, 1);
		}
	}

	user.addPost = function(postId) {
		posts.push(postId);
	}

	user.doesLike = function(id) {
		return (user.likes.indexOf(id) == -1) ? false : true;
	}

	user.getId = function() {
		return user.id;
	}

	return user;
});