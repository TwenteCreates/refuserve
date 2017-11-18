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

app.controller("chatCtrl", function($scope, $timeout, $localForage, $window, $interval) {
	$localForage.getItem("nErrors").then(function(nErrors) {
		$scope.nErrors = nErrors ? nErrors : 0;
	});
	$scope.selectOption = false;
	$scope.messages = [];
	$scope.doAction = function(content) {
		switch (content.toLowerCase().trim()) {
			case "/forget":
				$scope.botSays("Okay, bye bye!").then(function() {
					$localForage.setItem("messages", null).then(function() {
						$scope.messages = null;
						$window.location.reload();
					});
				});
				break;
			case "/refresh":
				$scope.botSays("Sounds good, refreshing the app.").then(function() {
					$window.location.reload();
				});
				break;
			case "/name":
				$localForage.getItem("name").then(function(name) {
					$scope.botSays("You told me your name is " + name + ".");
				});
				break;
			default:
				$scope.botSays(randomFromArray(["👍", "🤔", "🤷"]));
				break;
		}
	}
	if (!$scope.currentAction) {
		$localForage.setItem("currentAction", null);
	}
	$scope.sendMessage = function() {
		if ($scope.messageText) {
			var contentCopy = $scope.messageText;
			$localForage.getItem("currentAction").then(function(currentAction) {
				if (currentAction) {
					var error = 1, errorMessage = "I'm sorry, I didn't quite catch that.";
					if ($scope.nErrors > 3) {
						errorMessage = "It seems like you're having trouble with this.";
					}
					var content = contentCopy;
					if (currentAction == "name") {
						content = content.charAt(0).toUpperCase() + content.slice(1);
						var botMessage = randomFromArray(["Great! ", "Awesome! ", "Fantastic! ", "That's a pretty name! "]);
						botMessage += randomFromArray(["Nice to meet you, ", "It's so nice to meet you, ", "Let's be friends, ", "Pleasure to talk to you, ", "Let's get started, "]);
						botMessage += content + ".";
						$scope.botSays(botMessage);
						error = 0;
					} else if (currentAction == "age") {
						content = parseInt(content);
						if (isNaN(content)) {
							error = 1;
						} else {
							var botMessage = randomFromArray(["Great! ", "Awesome! ", "Fantastic! ", "Perfect! "]);
							botMessage += content + " years young.";
							$scope.botSays(botMessage);
							error = 0;
						}
					} else if (currentAction == "lang") {
						var botMessage = sayHelloIn(content) + "! I'll remember this to make things easier for you.";
						$scope.botSays(botMessage);
						error = 0;
					}
					if (error == 0) {
						$localForage.setItem("currentAction", null);
						$scope.currentAction = null;
						$localForage.setItem(currentAction, content);
					} else {
						$scope.nErrors++;
						$scope.botSays(errorMessage);
					}
				} else {
					$scope.doAction(contentCopy);
				}
			});
			$scope.messages.push({
				user: "user",
				text: $scope.messageText
			});
			$scope.messageText = "";
		}
		$scope.scrollToBottom();
		$scope.saveMessages();
	};
	$scope.scrollToBottom = function() {
		$(".chat-window").animate({ scrollTop: $(".chat-window").prop("scrollHeight") }, 500);
	};
	$scope.botSays = function(text, action = null, options = null) {
		if (options) {
			$scope.answerOptions = options;
			$scope.messageText = "Select an option";
			$scope.selectOption = 1;
		} else {
			$scope.answerOptions = null;
			$scope.selectOption = 0;
		}
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
				if (!$scope.currentAction) {
					$scope.currentAction = action;
				}
				$scope.saveMessages();
				if (!$scope.currentAction) {
					$timeout(resolve, 100);
				} else {
					$interval(function() {
						if (!$scope.currentAction) {
							resolve();
						}
					}, 100);
				}
			}, 100);
		});
	}
	$scope.saveMessages = function() {
		$localForage.setItem("messages", $scope.messages);
		$localForage.setItem("currentAction", $scope.currentAction);
	};
	$localForage.getItem("messages").then(function(messages) {
		if (messages) {
			$scope.messages = messages;
			$scope.scrollToBottom();
		} else {
			$scope.botSays("Hey stranger!").then(function() {
				$scope.botSays("Welcome to the App. What should I call you?", "name").then(function() {
					$scope.botSays("I'd love to get to know you better.").then(function() {
						$scope.botSays("How old are you? (Enter a number)", "age").then(function() {
							$scope.botSays("What's your native language?", "lang", ["English", "Hindi", "Arabic", "Urdu", "Turkish", "Spanish", "Portuguese", "Russian", "Chinese"]);
						});
					});
				});
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

function sayHelloIn(lang) {
	switch (lang) {
		case "Hindi":
			return "बहुत खुबस";
		case "Arabic":
			return "رائع";
		case "Urdu":
			return "زبردست";
		case "Turkish":
			return "Fantastik";
		case "Spanish":
			return "Fantástico";
		case "Portuguese":
			return "Fantástico";
		case "Russian":
			return "фантастика";
		case "Chinses":
			return "奇妙";
		default:
			return "Great";
			break;
	}
}