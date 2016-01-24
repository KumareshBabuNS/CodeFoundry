
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

app.controller('DialogController', function($scope, $rootScope, $mdDialog, $http, MockUser) {
	var changedTimes = 0;
	$scope.langOpts = $rootScope.langOptions;
	$scope.postToPublish = {
		author: {
			username: MockUser.getUsername(),
			id: MockUser.getId(),
			imageUrl: MockUser.getPhoto()
		},
		rating: 0
	}

	$scope.$watch("postToPublish.lang", function(oldVal, newVal) {
		changedTimes++;
		if(changedTimes > 1) {
			var el = document.getElementById("newPostEditor");
			editor = ace.edit(el);
			editor.session.setMode({
			   path: "ace/mode/" + $scope.postToPublish.lang.toLowerCase(),
			   v: Date.now() 
			});
		}
	});

	$scope.accept = function() {
		$scope.postToPublish.datePublished = new Date();
		MockUser.addPost({
			title: $scope.postToPublish.title,
			lang: $scope.postToPublish.lang,
			date: $scope.postToPublish.datePublished
		});

		$http.post("/save", JSON.stringify($scope.postToPublish)).success(function(respose) {
			console.log("Posted successfully!");
			$mdDialog.hide();
		}).catch(function(err) {
			console.log("There was problem posting... " + err);
		})
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	}
});

app.controller('profileController', function($scope, $http, $mdDialog, $mdMedia, MockUser) {
	$http.get('loaduser').success(function(response) {
		$scope.published = response;
		$scope.userPhoto = MockUser.getPhoto();
		$scope.userName = MockUser.getUsername();
		$scope.userEmail = MockUser.getUserEmail();
		$scope.liked = MockUser.getLiked();
		$scope.interests = MockUser.getInterests();
		$scope.mode = "JavaScript";
	}).catch(function() {
		console.log("Couldn't load posts...");
	});

	$scope.showAdvanced = function(ev) {
	    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
	    $mdDialog.show({
	      controller: 'DialogController',
	      templateUrl: 'templates/publisher.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: useFullScreen
	    })
	    .then(function(answer) {
	      
	    }, function() {
	      
	    });
	    $scope.$watch(function() {
	      return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
	      $scope.customFullscreen = (wantsFullScreen === true);
	    });
	  };
});	

app.controller('postsController', function($scope, $http, $rootScope, MockUser) {
	$http.get("/load").success(function(response) {
		$scope.apiPosts = response;
	}).catch(function(err) {
		console.log("Couldn't get api posts from db...");
	})
	//$scope.eventSources = [];
	$scope.aceLoaded = function(idx, post) {
		var el = document.getElementById("editor" + idx);
		editor = ace.edit(el);
		editor.session.setValue(post.code);
	}

	$scope.updateLikeData = function(post) {
		//add the post id to the list of the currently logged in user's likes 
		if(MockUser.doesLike(post)) {
			MockUser.removeLike(post);
			post.rating--;
		} else {
			MockUser.addLike(post);
			post.rating++;
		}
		//send update request to backend to update post
	}
});

app.directive("apiPost", function() {
	return {
		templateUrl: 'partials/apiPost.html'
	}
});

app.directive("selfPost", function() {
	return {
		templateUrl: 'partials/selfPost.html'
	}
})

/*we need not demonstrate fully functioning login features as it's not the core concept of our app, we'll fill in 
  these details with a mock user*/
app.factory("MockUser", function() {
	var user = {};

	user.id = "8346509f62h1";
	user.username = "Vuk_Pet_Wolf";
	user.email = "vukpetrovic1@yahoo.com";
	user.password = "password"; //lol because it is such a common password for people appearantly 
	user.imageUrl = "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/5/005/078/11a/206c973.jpg";
	user.interests = ["JavaScript", "CSS", "HTML", "C++", "Java", "Web Development", "Algorithms"];
	user.likes = [];
	user.posts = [
		{
			title: "Twilio API call",
			lang: "JavaScript",
			datePublished: "1-21-2016",
		}, 
		{
			title: "Quicksort implementation",
			lang: "JavaScript",
			datePublished: "1-22-2016",
		},
		{
			title: "Carousel",
			lang: "HTML",
			datePublished: "1-23-2016",
		}
	];

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
		user.posts.push(postId);
	}

	user.doesLike = function(post) {
		return (user.likes.indexOf(post) == -1) ? false : true;
	}

	user.getId = function() {
		return user.id;
	}

	user.getPhoto = function() {
		return user.imageUrl;
	}

	user.getUsername = function() {
		return user.username;
	}

	user.getUserEmail = function() {
		return user.email;
	}

	user.getPosts = function() {
		return user.posts;
	}

	user.getLiked = function() {
		return user.likes;
	}

	user.getInterests = function() {
		return user.interests;
	}

	return user;
});