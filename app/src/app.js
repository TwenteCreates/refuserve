require("angular");
var RSVP = require("rsvp");

var app = angular.module("hackApp", [require("angular-route")]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "views/chat.html",
		controller: "chatCtrl"
	})
	.when("/red", {
		templateUrl: "red.htm",
		controller: "chatCtrl"
	})
	.when("/green", {
		templateUrl: "green.htm",
		controller: "chatCtrl"
	})
	.when("/blue", {
		templateUrl: "blue.htm",
		controller: "chatCtrl"
	});
});

// app.controller("pageCtrl", function($scope, $location) {
// 	$scope.showChat = $location.$$path === "/";
// 	$scope.$on("$locationChangeStart", function(event) {
// 		$scope.showChat = $location.$$path === "/";
// 	});
// });

app.controller("chatCtrl", function($scope, $timeout) {
	$scope.messages = [];
	$(".messenger-block").css("bottom", $(".primary-navbar").height() + "px");
	$(".chat-window").css("height", $(document).height() - $(".primary-header").height() - $(".primary-navbar").height() - 5 + "px");
	$scope.sendMessage = function() {
		$scope.messages.push({
			user: "user",
			text: $scope.messageText
		});
		switch ($scope.messageText) {
			case "forget":
				$scope.botSays("Okay, bye bye!");
				break;
			default:
				break;
		}
		$scope.messageText = "";
		$scope.scrollToBottom();
	};
	$scope.scrollToBottom = function() {
		$(".chat-window").animate({ scrollTop: $(".chat-window").prop("scrollHeight") }, 500);
	};
	$scope.botSays = function(text) {
		$(".typing-chatbox").show();
		return new Promise((resolve, reject) => {
			$timeout(function() {
				$(".typing-chatbox").hide();
				$scope.messages.push({
					user: "bot",
					text: text
				});
				$timeout(resolve, 1000);
			}, 1500);
		});
	}
	$scope.sayHello = function() {
		$scope.botSays("Hey stranger!").then(function() {
			$scope.botSays("Welcome to the App. What should I call you?");
		});
	};
	$scope.sayHello();
});

window.onload = function() {
	$(".chat-window").css("height", $(document).height() - $(".messenger-block").height() - $(".primary-header").height() - $(".primary-navbar").height() - 5 + "px");
}