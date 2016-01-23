
var app = angular.module("CodeFoundry", ['ngRoute', 'ngMaterial', 'ngAnimate']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
      	templateUrl: 'templates/home.html',
        controller: 'homeController'
      })
      .otherwise({
        redirectTo: '/'
      });
}]);

app.controller('homeController', function($scope, $http) {
	$scope.test = "Hello, World";
});