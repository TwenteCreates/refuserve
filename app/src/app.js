require("angular");

var app = angular.module("hackApp", [require("angular-route"), require("angular-localforage")]);

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

app.controller("chatCtrl", function($scope, $timeout, $localForage, $window) {
	$scope.messages = [];
	$scope.doAction = function(content) {
		switch (content.toLowerCase().trim()) {
			case "forget":
				$scope.botSays("Okay, bye bye!").then(function() {
					$localForage.setItem("messages", null).then(function() {
						$scope.messages = null;
						$window.location.reload();
					});
				});
				break;
			case "refresh":
				$scope.botSays("Sounds good, refreshing the app.").then(function() {
					$window.location.reload();
				});
				break;
			default:
				$scope.botSays(randomFromArray(["👍", "🤔", "🤷"]));
				break;
		}
	}
	$scope.sendMessage = function() {
		if ($scope.messageText) {
			$scope.doAction($scope.messageText);
			$scope.messages.push({
				user: "user",
				text: $scope.messageText
			});
		}
		$scope.messageText = "";
		$scope.scrollToBottom();
		$scope.saveMessages();
	};
	$scope.scrollToBottom = function() {
		$(".chat-window").animate({ scrollTop: $(".chat-window").prop("scrollHeight") }, 500);
	};
	$scope.botSays = function(text, action) {
		$(".typing-chatbox").show();
		$timeout(function() {
			$scope.scrollToBottom();
		}, 1);
		return new Promise((resolve, reject) => {
			$timeout(function() {
				$(".typing-chatbox").hide();
				$scope.messages.push({
					user: "bot",
					text: text
				});
				$scope.scrollToBottom();
				$scope.currentAction = "name";
				$scope.saveMessages();
				$timeout(resolve, 1000);
			}, 1500);
		});
	}
	$scope.saveMessages = function() {
		console.log($scope.messages);
		$localForage.setItem("messages", $scope.messages);
		$localForage.setItem("currentAction", $scope.currentAction);
	};
	$localForage.getItem("messages").then(function(messages) {
		if (messages) {
			$scope.messages = messages;
			$scope.scrollToBottom();
		} else {
			$scope.botSays("Hey stranger!").then(function() {
				$scope.botSays("Welcome to the App. What should I call you?");
			});
		}
	});
});

window.onload = function() {
	// $(".chat-window").css("height", $(document).height() - $(".messenger-block").height() - $(".primary-header").height() - $(".primary-navbar").height() - 5 + "px");
}

function randomFromArray(items) {
	return items[Math.floor(Math.random() * items.length)];
}