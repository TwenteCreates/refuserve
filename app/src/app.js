require("angular");

var app = angular.module("hackApp", [require("angular-route")]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "views/chat.html"
	})
	.when("/red", {
		templateUrl : "red.htm"
	})
	.when("/green", {
		templateUrl : "green.htm"
	})
	.when("/blue", {
		templateUrl : "blue.htm"
	});
});

app.controller("chat", function($scope) {
	$scope.firstName= "John";
	$scope.lastName= "Doe";
});

window.onload = function() {
	$("#content").css("height", $(document).height() - $(".primary-header").height() - $(".primary-navbar").height() - 5 + "px");
}