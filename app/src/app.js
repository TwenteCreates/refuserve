require("angular");

var devMode = 1;

var app = angular.module("hackApp", [require("angular-route"), require("angular-localforage")]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "views/chat.html",
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

	// Initializations
	$scope.messages = []; // Empty array for messages
	$scope.inputType = 0; // [0 => text, 1 => select, 2 => range]

	// Array for basic Q and A
	$scope.questions = [{
		text: "Hey stranger!"
	}, {
		text: "Welcome to RefuServe. What should I call you?",
		var: "name",
		reply: "That's a pretty name, {{ var }}!",
		validate: /^[a-zA-Z ]{2,30}$/
	}, {
		text: "I'd love to get to know you better."
	}, {
		text: "How old are you? (Enter a number)",
		var: "age",
		reply: "Perfect, {{ var }} years young."
	}, {
		text: "What's your native language?",
		var: "lang",
		options: ["English", "Hindi", "Arabic", "Urdu", "Turkish", "Spanish", "Portuguese", "Russian", "Chinese"],
		reply: "Beautiful language"
	}, {
		text: "Great, I just need some contact information from you now, and we can continue."
	}, {
		text: "What's your phone number?",
		var: "phone",
		reply: "Perfect. I'll use this on your resume."
	}, {
		text: "What's your primary email?",
		var: "email",
		validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		reply: "Don't worry, I won't spam you. Maybe the occassional joke with a job reference. 😉"
	}, {
		text: "Now comes the exciting part: let's build your work profile!",
	}, {
		text: "That's all, folks!"
	}];

	// Check if history exist in local storage
	$localForage.getItem("messages").then(function(messages) {
		if (messages) {
			$scope.messages = messages;
			$(".chat-window").animate({ scrollTop: $(".chat-window").prop("scrollHeight") }, 500);
			$localForage.getItem("QAStatus").then(function(QAStatus) {
				if (QAStatus != $scope.questions.length + 1) {
					$scope.converse();
				}
			});
			devInfo("LocalStorage: Loaded " + messages.length + " messages");
		} else {
			$scope.converse();
			devInfo("LocalStorage: No messages");
		}
	});

	// Function to add message to DOM and local storage
	$scope.addMessage = (user, text) => {
		$scope.messages.push({
			user: user,
			text: text
		});
		$localForage.setItem("messages", $scope.messages).then(function() {
			devInfo("LocalStorage: Saved " + $scope.messages.length + " messages");
		});
		$(".chat-window").animate({ scrollTop: $(".chat-window").prop("scrollHeight") }, 500);
	}

	// Array for debugging methods
	$scope.debuggers = [{
		key: "refresh|reload",
		fn: function() {
			$window.location.reload();
		}
	}, {
		key: "forget|delete|reset|clear",
		fn: function() {
			$localForage.clear().then(function() {
				$window.location.reload();
			});
		}
	}, {
		key: "name",
		fn: function() {
			$localForage.getItem("name").then(function(name) {
				if (name) {
					$scope.say("You told me your name is " + name + ".");
				} else {
					$scope.say("I do not know your name yet.");
				}
			});
		}
	}];

	// Function to handle formSubmit from user
	var debuggers = [];
	for (var i = 0; i < $scope.debuggers.length; i++) {
		var k = $scope.debuggers[i].key.split("|");
		for (var j = 0; j < k.length; j++) {
			debuggers.push(k[j]);
		}
	}
	devInfo("Dev commands: " + JSON.stringify(debuggers));
	$scope.sendMessage = function() {
		if ($scope.messageText) {
			var userMessage = $scope.messageText.trim();
		} else {
			return;
		}
		$scope.messageText = "";
		$scope.addMessage("user", userMessage);
		if (debuggers.includes(userMessage.replace("/", "").toLowerCase())) {
			for (var i = 0; i < $scope.debuggers.length; i++) {
				if ($scope.debuggers[i].key.includes(userMessage.replace("/", "").toLowerCase())) {
					$scope.debuggers[i].fn();
					devInfo("Debugging command " + $scope.debuggers[i].key);
				}
			}
		} else {
			// Check for reply
			$localForage.getItem("QAStatus").then(function(QAStatus) {
				if (QAStatus != $scope.questions.length + 1) {
					if ($scope.questions[QAStatus - 1]) {
						if ($scope.questions[QAStatus - 1].var) {
							if ($scope.questions[QAStatus - 1].validate) {
								if ($scope.questions[QAStatus - 1].validate.test(userMessage)) {
									$localForage.setItem($scope.questions[QAStatus - 1].var, userMessage).then(function() {
										$scope.say($scope.questions[QAStatus - 1].reply.replace("{{ var }}", userMessage.charAt(0).toUpperCase() + userMessage.slice(1))).then($scope.converse);
									});
								} else {
									var responses = ["Hey, I don't think that's a valid input. Sorry if I'm being mean, but my bosses are very strict.", "Hey, come on, I don't think that's your real " + $scope.questions[QAStatus - 1].var + ".", "I don't think that's a valid input. Can you please try again? 🤔", "I'm a bit confused by your response. What do you mean?", "Are you sure that's your " + $scope.questions[QAStatus - 1].var + "? I think you've got it wrong.", "If only " + $scope.questions[QAStatus - 1].var + "s looked like that... come on, your real " + $scope.questions[QAStatus - 1].var + ", please?"];
									$scope.say(responses[Math.floor(Math.random() * (responses.length - 0 + 1)) + 0]);
								}
							} else {
								$localForage.setItem($scope.questions[QAStatus - 1].var, userMessage).then(function() {
									$scope.say($scope.questions[QAStatus - 1].reply.replace("{{ var }}", userMessage.charAt(0).toUpperCase() + userMessage.slice(1))).then($scope.converse);
								});
							}
						}
					}
				}
			});
		}
	}

	var speed = 100;

	// Function for speaking
	$scope.say = function(botMessage) {
		$(".typing-chatbox").show();
		$timeout(function() {
			$(".chat-window").animate({ scrollTop: $(".chat-window").prop("scrollHeight") }, 500);
		}, 1);
		return new Promise(function(resolve, reject) {
			$timeout(function() {
				$(".typing-chatbox").hide();
				$scope.addMessage("bot", botMessage);
				$timeout(resolve, speed);
			}, speed * 1.5);
		});
	}

	// Function to start conversing
	$scope.converse = function() {
		var goNext = function(QAStatus) {
			if ($scope.questions[QAStatus]) {
				$scope.say($scope.questions[QAStatus].text).then(function() {
					$localForage.setItem("QAStatus", QAStatus + 1).then($scope.converse);
				});
			} else {
				$scope.inputType = 0;
				$scope.options = [];
				$scope.messageText = "";
			}
		};
		$localForage.getItem("QAStatus").then(function(QAStatus) {
			if (QAStatus <= $scope.questions.length) {
				var cont = 1;
				if (!QAStatus) {
					QAStatus = 0;
				}
				if ($scope.questions[QAStatus - 1]) {
					if ($scope.questions[QAStatus - 1].var) {
						if ($scope.questions[QAStatus - 1].options) {
							devInfo("This question has multiple options");
							$scope.inputType = 1;
							$scope.messageText = "Select an option";
							$scope.answerOptions = $scope.questions[QAStatus - 1].options;
						} else {
							$scope.inputType = 0;
							$scope.options = [];
							$scope.messageText = "";
						}
						$localForage.getItem($scope.questions[QAStatus - 1].var).then(function(variable) {
							if (!variable) {
								cont = 0;
							} else {
								goNext(QAStatus);
							}
						});
					} else {
						goNext(QAStatus);
					}
				} else {
					goNext(QAStatus);
				}
			}
		});
	}

});

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

function devInfo(message) {
	if (devMode === 1) {
		console.info(message);
	}
}