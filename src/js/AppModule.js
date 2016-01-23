
var app = angular.module("CodeFoundry", ['ngRoute', 'ngMaterial', 'ngAnimate']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/posts', {
      	templateUrl: 'templates/posts.html',
        controller: 'postsController'
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
app.run(function($rootScope) {
	$rootScope.logoIcon = "assets/anvil.png";
	$rootScope.appName = "CodeFoundry";
	$rootScope.settingsOpen = false;
});

app.controller('homeController', function($scope, $http) {
	$scope.msg = "This is the home page, under construction.";
});

app.controller('postsController', function($scope, $http, $rootScope) {
	$rootScope.profileOptions = [
		"Profile",
		"Your Likes",
		"Log Out"
	]
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