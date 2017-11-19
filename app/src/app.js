require("angular");
require("ng-youtube-embed");

var devMode = 1;

var app = angular.module("hackApp", [require("angular-route"), require("angular-localforage"), "ngYoutubeEmbed"]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "views/chat.html",
		controller: "chatCtrl"
	}).when("/access", {
		templateUrl: "views/access.html",
		// controller: "chatCtrl"
	}).when("/library", {
		templateUrl: "views/library.html",
		controller: "libraryCtrl"
	}).when("/settings", {
		templateUrl: "views/settings.html",
		// controller: "libraryCtrl"
	}).when("/resume", {
		templateUrl: "views/resume.html",
		controller: "resumeCtrl"
	}).when("/video/:videoId", {
		templateUrl: "views/video.html",
		controller: "videoCtrl"
	});
});

app.controller("pageCtrl", function($scope, $location) {
	$scope.currentPage = $location.$$path;
	$scope.$on("$locationChangeStart", function(event) {
		$scope.currentPage = $location.$$path;
	});
});

app.controller("resumeCtrl", function($scope, $localForage, $timeout, $http) {
	$scope.initX = 0;
	$scope.showResume = function() {
		$scope.initX = 1;
		$localForage.getItem("name").then(function(name) {
			$scope.name = name;
		});
		$localForage.getItem("mostRecentJob_position").then(function(mostRecentJob_position) {
			$scope.mostRecentJob_position = mostRecentJob_position;
		});
		$localForage.getItem("phone").then(function(phone) {
			$scope.phone = phone;
		});
		$localForage.getItem("email").then(function(email) {
			$scope.email = email;
		});
		$localForage.getItem("lang").then(function(lang) {
			$scope.lang = lang;
		});
		$localForage.getItem("skill1").then(function(skill1) {
			$scope.skill1 = skill1;
		});
		$localForage.getItem("skill2").then(function(skill2) {
			$scope.skill2 = skill2;
		});
		$localForage.getItem("skill3").then(function(skill3) {
			$scope.skill3 = skill3;
		});
		$localForage.getItem("mostRecentJob_location").then(function(mostRecentJob_location) {
			$scope.mostRecentJob_location = mostRecentJob_location;
		});
		$localForage.getItem("mostRecentJob_position").then(function(mostRecentJob_position) {
			$scope.mostRecentJob_position = mostRecentJob_position;
		});
		$localForage.getItem("mostRecentJob_startDate").then(function(mostRecentJob_startDate) {
			$scope.mostRecentJob_startDate = mostRecentJob_startDate;
		});
		$localForage.getItem("mostRecentJob_endDate").then(function(mostRecentJob_endDate) {
			$scope.mostRecentJob_endDate = mostRecentJob_endDate;
		});
		$localForage.getItem("willingToRelocate").then(function(willingToRelocate) {
			$scope.willingToRelocate = willingToRelocate;
		});
		$localForage.getItem("coverLetter").then(function(coverLetter) {
			$http.get("https://api.refuserve.ga/translate?text=" + encodeURIComponent(coverLetter) + "&dest=en").then(function(response) {
				$scope.coverLetter = response.data.value;
			});
		});
	}
});

app.controller("videoCtrl", function($scope, $localForage, $timeout, $routeParams, ngYoutubeEmbedService, $http) {

	$scope.vidIS = $routeParams["videoId"];
	var player = ngYoutubeEmbedService.getPlayerById("vidIS");
	console.log(player);
	// player.playVideo();
	$timeout(function() {
		console.log($scope.videoElt);
	}, 1000);

	$http.post("https://api.refuserve.ga/voice-changer?url=" + "https://www.youtube.com/watch?v=" + $routeParams["videoId"]).then(function(response) {
		$scope.videoSUB = response.data.transcript;
	});

});

app.controller("libraryCtrl", function($scope, $localForage) {

	// Initialize
	$scope.hasLibrary = 0;

	// Get library material
	$localForage.getItem("library").then(function(library) {
		if (library) {
			$scope.hasLibrary = 1;
			$scope.library = library;
		}
	});

});

app.controller("chatCtrl", function($scope, $timeout, $localForage, $window, $http) {

	// Initializations
	$scope.messages = []; // Empty array for messages
	$scope.inputType = 0; // [0 => text, 1 => select, 2 => button]

	// Array for basic Q and A
	$scope.questions = [{
		text: "Hi friend! 👋"
	}, {
		text: "Welcome to RefuServe. What should I call you?",
		tip: "Type your name to continue.",
		var: "name",
		reply: "That's a pretty name, {{ var }}!",
		validate: /^[a-zA-Z ]{2,30}$/
	}, {
		text: "I'd love to get to know you better.",
		var: "startInit",
		button: "Let's go! 😄",
		reply: "Fantastic."
	}, {
		text: "How old are you?",
		tip: "Enter a number",
		var: "age",
		reply: "Perfect, {{ var }} years young.",
		validate: /^\d+$/
	}, {
		text: "What's your native language?",
		var: "lang",
		options: [{ id: "en", text: "English" }, { id: "hi", text: "Hindi" }, { id: "ar", text: "Arabic" }, { id: "ur", text: "Urdu" }, { id: "tr", text: "Turkish" }, { id: "es", text: "Spanish" }, { id: "pt", text: "Portuguese" }, { id: "ru", text: "Russian" }, { id: "zh-CN", text: "Chinese" }],
		reply: "That's a beautiful language! I'll remember this to make things easier for you later."
	}, {
		text: "Where in Europe have/will you move?",
		var: "learnLanguage",
		options: [
			{ id: "Bulgarian", text: "Bulgaria" },
			{ id: "Croatian", text: "Croatia" },
			{ id: "Czech", text: "Czech Republic" },
			{ id: "Danish", text: "Denmark" },
			{ id: "Dutch", text: "Netherlands" },
			{ id: "English", text: "England" },
			{ id: "Estonian", text: "Estonia" },
			{ id: "Finnish", text: "Finland" },
			{ id: "French", text: "Franch" },
			{ id: "German", text: "Germany" },
			{ id: "Greek", text: "Greece" },
			{ id: "Hungarian", text: "Hungary" },
			{ id: "Irish", text: "Ireland" },
			{ id: "Italian", text: "Italy" },
			{ id: "Latvian", text: "Latvia" },
			{ id: "Lithuanian", text: "Lithuania" },
			{ id: "Maltese", text: "Malta" },
			{ id: "Polish", text: "Poland" },
			{ id: "Portuguese", text: "Portugal" },
			{ id: "Romanian", text: "Romania" },
			{ id: "Slovak", text: "Slovakia" },
			{ id: "Slovenian", text: "Slovenia" },
			{ id: "Spanish", text: "Spain" },
			{ id: "Swedish", text: "Sweden" }
		],
		reply: "Great place to be! I'll also help you learn their language."
	}, {
		text: "I now just need some contact information from you now, and we can continue. 📱"
	}, {
		text: "What's your phone number?",
		var: "phone",
		reply: "Perfect. I'll use this on your resume.",
		validate: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
	}, {
		text: "What's your primary email?",
		var: "email",
		validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		reply: "Don't worry, I won't spam you. Maybe the occassional joke with a job reference. 😉"
	}, {
		text: "Now comes the exciting part: let's build your work profile!",
	}, {
		text: "Tell me, what's a skill you're good at?",
		tip: "eg. JavaScript",
		var: "skill1",
		reply: "Okay, great!"
	}, {
		text: "Now can you tell me another one?",
		tip: "eg. Management",
		var: "skill2",
		reply: "Fantastic!"
	}, {
		text: "Finally, a third one. This will help me understand your potential.",
		var: "skill3",
		reply: "I'm impressed! 🙏"
	}, {
		text: "I'm excited to hear about your diverse abilities. Let me think about what I can recommend you for.",
	}, {
		returnCall: function() {
			return new Promise(function(resolve, reject) {
				$localForage.getItem("skill1").then(function(skill1) {
					$localForage.getItem("skill2").then(function(skill2) {
						$localForage.getItem("skill3").then(function(skill3) {
							$http.get("https://api.refuserve.ga/recommend/jobs?skills=" + encodeURIComponent(skill1) + "," + encodeURIComponent(skill2) + "," + encodeURIComponent(skill3)).then(function(response) {
								var arrayResponse = response.data;
								// if (arrayResponse.length == 1) {
								// 	resolve(arrayResponse[0]);
								// } else {
								// 	var result = "Choose between (1) " + arrayResponse[0];
								// 	for (var i = 1; i < arrayResponse.length; i++) {
								// 		result += ", (" + i + 1 + ")" + arrayResponse[i];
								// 	}
								// 	$localForage.setItem("nextOptions", arrayResponse).then(function() {
								// 		resolve(result);
								// 	});
								// }
								$localForage.setItem("jobName", arrayResponse[0]).then(function() {
									resolve(arrayResponse[0]);
								});
							});
						});
					});
				});
			});
		},
		text: "Here's what I think you should consider: {{ response }}",
	}, {
		text: "Let's get started with some skill building now! 💪",
		button: "Yes, please!",
		var: "initDone",
		reply: "Awesome! I'm looking for free MOOCs, videos, and lessons to improve your skills."
	}, {
		returnCall: function() {
			return new Promise(function(resolve, reject) {
				$localForage.getItem("jobName").then(function(jobName) {
					$localForage.getItem("skill1").then(function(skill1) {
						$localForage.getItem("skill2").then(function(skill2) {
							$localForage.getItem("skill3").then(function(skill3) {
								$localForage.getItem("learnLanguage").then(function(learnLanguage) {
									$http.get("https://api.refuserve.ga/recommend/videos?job=" + encodeURIComponent(jobName) + "&skills=" + encodeURIComponent(skill1) + "," + encodeURIComponent(skill2) + "," + encodeURIComponent(skill3) + "&lang=" + learnLanguage).then(function(response) {
										$localForage.setItem("library", response.data).then(function() {
											resolve(response.data.length);
										});
									});
								});
							});
						});
					});
				});
			});
		},
		text: "I found {{ response }} great resources to expand your skillset."
	}, {
		text: "I've added them to your library. You can start learning now.",
		callToAction: "Go to Library",
		callToActionLink: "/library"
	}, {
		text: "I can also help you build your resume.",
	}, {
		text: "Do you want to get started with that?",
		button: "Absolutely 🙌",
		var: "startResume",
		reply: "Okay. Let me ask you some quick questions."
	}, {
		text: "What was your most recent job position?",
		tip: "eg. Web Developer",
		var: "mostRecentJob_position",
		reply: "Lovely."
	}, {
		text: "Where did you do that job?",
		tip: "eg. Trivago GmbH",
		var: "mostRecentJob_location",
		reply: "Okay, great!"
	}, {
		text: "When did you start that job?",
		tip: "eg. March 2010",
		var: "mostRecentJob_startDate",
		reply: "Perfect."
	}, {
		text: "And when did it end?",
		tip: "eg. January 2014",
		var: "mostRecentJob_endDate",
		reply: "Great, we're almost done!"
	}, {
		text: "Let's write a cover letter now. You can write it in your native language, and I'll take care of it.",
		var: "coverLetter",
		reply: "I couldn't have said it better."
	}, {
		text: "Are you willing to relocate to another city or country?",
		var: "willingToRelocate",
		options: [{ id: "Yes", text: "Yes" }, { id: "No", text: "No" }],
		reply: "Great, that's all I need for now!",
	}, {
		text: "Your shiny new resume is ready! 🎉",
		callToAction: "Go to Resume",
		callToActionLink: "/resume"
	}, {
		text: "Let me know if there's anything else I can help out with. 😊",
		var: "NeXTSTEP",
		options: [{ id: "resume", text: "Update my resume" }, { id: "settings", text: "Change my settings" }, { id: "help", text: "I need some help" }]
	}];

	// Check if history exist in local storage
	$localForage.getItem("messages").then(function(messages) {
		if (messages) {
			$scope.messages = messages;
			$timeout(function() {
				$(".chat-window").scrollTop($(".chat-window").prop("scrollHeight"));
			}, 1);
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
	$scope.addMessage = (user, text, tip, callToAction, callToActionLink) => {
		tip = tip || null;
		callToAction = callToAction || null;
		callToActionLink = callToActionLink || null;
		$scope.messages.push({
			user: user,
			text: text,
			tip: tip,
			callToAction: callToAction,
			callToActionLink: callToActionLink
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
		$scope.inputType = 0;
		$scope.options = [];
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
									devInfo($scope.questions[QAStatus - 1].var + " validated successfully");
									$localForage.setItem($scope.questions[QAStatus - 1].var, userMessage).then(function() {
										$scope.say($scope.questions[QAStatus - 1].reply.replace("{{ var }}", userMessage.charAt(0).toUpperCase() + userMessage.slice(1))).then($scope.converse);
									});
								} else {
									var responses = ["Hey, I don't think that's a valid input. Sorry if I'm being mean, but my bosses are very strict.", "Hey, come on, I don't think that's your real " + $scope.questions[QAStatus - 1].var + ".", "I don't think that's a valid input. Can you please try again? 🤔", "I'm a bit confused by your response. What do you mean?", "Are you sure that's your " + $scope.questions[QAStatus - 1].var + "? I think you've got it wrong.", "If only " + $scope.questions[QAStatus - 1].var + "s looked like that... come on, your real " + $scope.questions[QAStatus - 1].var + ", please?"];
									$scope.say(responses[Math.floor(Math.random() * (responses.length - 1))]);
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

	var speed = 1000;
	if (document.domain == "127.0.0.1") {
		speed = 100;
	}

	// Function for speaking
	$scope.say = function(botMessage, tip, callToAction, callToActionLink) {
		tip = tip || null;
		callToAction = callToAction || null;
		callToActionLink = callToActionLink || null;
		$(".typing-chatbox").show();
		$timeout(function() {
			$(".chat-window").animate({ scrollTop: $(".chat-window").prop("scrollHeight") }, 500);
		}, 1);
		return new Promise(function(resolve, reject) {
			$timeout(function() {
				$(".typing-chatbox").hide();
				$scope.addMessage("bot", botMessage, tip, callToAction, callToActionLink);
				$timeout(resolve, speed);
			}, speed * 1.5);
		});
	}

	// Function to start conversing
	$scope.converse = function() {
		var goNext = function(QAStatus) {
			if ($scope.questions[QAStatus]) {
				if (typeof $scope.questions[QAStatus].returnCall == "function") {
					$scope.questions[QAStatus].returnCall().then(function(response) {
						$scope.say($scope.questions[QAStatus].text.replace("{{ response }}", response), $scope.questions[QAStatus].tip, $scope.questions[QAStatus].callToAction, $scope.questions[QAStatus].callToActionLink).then(function() {
							$localForage.setItem("QAStatus", QAStatus + 1).then($scope.converse);
						});
					});
				} else {
					$scope.say($scope.questions[QAStatus].text, $scope.questions[QAStatus].tip, $scope.questions[QAStatus].callToAction, $scope.questions[QAStatus].callToActionLink).then(function() {
						$localForage.setItem("QAStatus", QAStatus + 1).then($scope.converse);
					});
				}
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
						} else if ($scope.questions[QAStatus - 1].button) {
							devInfo("This question has a single button");
							$scope.inputType = 2;
							$scope.messageText = $scope.questions[QAStatus - 1].button;
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