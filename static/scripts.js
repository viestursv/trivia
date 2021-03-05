// Global rules and counters
// All quiz question id's
let quizArray = []

for (let i = 1; i < 37; i++) {
    quizArray.push(i)    
}

// Quiz progress keeper
let quiz = {
    activeQuizes: quizArray.map(q => q),
    score: {
        correct: 0,
        wrong: 0
    },
    history: []
   
}

//Start up page load
$( document ).ready(function() {
	setTimeout(
	$("body").fadeIn(),
	$("#en-button").fadeIn(),
	$("#de-button").fadeIn(),
	 10000)    
});

//View Init
function viewSelect(view) {
    $("button").prop("disabled",true);
    setTimeout(function(){ 
	$("button").prop("disabled",false);
    }, 1000)
	
    
    $('.layout').fadeOut()
    $('#' + view).fadeIn() 
    if (view === 'mode-select-en') {
	$("#btn-easy-en").fadeIn()
	$("#btn-hard-en").fadeIn()
    } else if (view === 'mode-select-de') {
	$("#btn-easy-de").fadeIn()
	$("#btn-hard-de").fadeIn()
    }
    if (view === 'hard-mode-de' || view === 'easy-mode-de' || view === 'hard-mode-en' || view === 'easy-mode-en') {
        getRandomQuiz(view)
    }
}

// Functions

function getRandomQuiz(mode) {
    if (mode === 'hard-mode-de' || mode === 'easy-mode-de' || mode === 'hard-mode-en' || mode === 'easy-mode-en') {
            let randomQuizKey = Math.floor(Math.random() * quiz.activeQuizes.length)
            let quizOutput = quiz.activeQuizes[randomQuizKey]

            //history counter
            quiz.history.push(quizOutput)
            //quiz template name
            let quizId = 'default'
            
            if (mode === 'hard-mode-de' || mode === 'hard-mode-en') {
		    quizId = 'building' + quizOutput + 'h'
	    } else if (mode === 'easy-mode-de' || mode === 'easy-mode-en') {
		    quizId = 'building' + quizOutput + 'e'
	    }
	    
	    let ajaxUrl
	    
	    if (mode === 'hard-mode-de' || mode === 'easy-mode-de') {
		ajaxUrl = "/views_de"

	    } else  if (mode === 'hard-mode-en' || mode === 'easy-mode-en') {
		ajaxUrl = "/views_en"
	    	    
	    }
            //content
            $.ajax({
		    url: ajaxUrl,
		    method: "POST",
		    data: JSON.stringify(quizId),
		    //data: "hello",
		    contentType: 'application/json;charset=UTF-8',
		    success: function(data) {
			    $(".quiz-content").html("<h1 class='content'><p>" + quizId + "</p>" + data + "</div>");
		    }
	    });
            //output
            //$('.quiz-content').html("<h1 class='content'> " + mode + " quiz content #" + quizOutput + "</h1>")
            quiz.activeQuizes.splice(randomQuizKey, 1)

    }
}
function clickSound (target) {
	if (target==="home") {
		let audio = new Audio('static/assets/sounds/1pagebuttonclick.mp3');
        audio.play()
	} else if (target==="36btn") {
	let audio = new Audio('static/assets/sounds/SoundFor36Buttons.mp3');
	audio.play()
	}
}
function checkScore() {
		   
}
function guessBuilding(id, mode) {
    $("button").prop("disabled",true);
    setTimeout(function(){ 
	$("button").prop("disabled",false);
    }, 1000)
	
    $('.layout').fadeOut()
    
    if (id === String(quiz.history[quiz.history.length - 1])) {
		//activate python script for GPIO control
        $.ajax({
			url: "/ajax",
			method: "POST",
			data: JSON.stringify(parseInt(id)),
			contentType: 'application/json;charset=UTF-8',
			success: function(data) {
				//console.log(data);
			}
		});
	if (mode === 'hard-mode-de' || mode === 'easy-mode-de') {
	    $('#correct-de').fadeIn();
	} else  if (mode === 'hard-mode-en' || mode === 'easy-mode-en') {
	    $('#correct-en').fadeIn();
	}
        
        let audio = new Audio('static/assets/sounds/ScreenRichtig.mp3');
        audio.play()
        quiz.score.correct++
    } else {
	if (mode === 'hard-mode-de' || mode === 'easy-mode-de') {
	    $('#wrong-de').fadeIn();
	} else  if (mode === 'hard-mode-en' || mode === 'easy-mode-en') {
	    $('#wrong-en').fadeIn();
	}
	
	let audio = new Audio('static/assets/sounds/ScreenFalsch.mp3');
        audio.play()
        quiz.score.wrong++
    }
    
    let lang
    if (mode === 'hard-mode-de' || mode === 'easy-mode-de') {
	lang = "-de"
    } else  if (mode === 'hard-mode-en' || mode === 'easy-mode-en') {
	lang = "-en"
    }
    
    if (quiz.history.length === 6) {
	
		if (quiz.score.correct < 2) {
			$("#score-C").html(quiz.score.correct)
			$("#score-W").html(quiz.score.wrong)
			let audio = new Audio('static/assets/sounds/0-4 screen.mp3');
			setTimeout(function(){ 
				$('#correct' + lang).fadeOut(),
				$('#wrong' + lang).fadeOut(),
				viewSelect('results-0-1' + lang),
				$(".scoreboard-container").fadeIn(),
				audio.play()
				}, 5000)
		} else if (quiz.score.correct > 1 && quiz.score.correct < 4) {
			$("#score-C").html(quiz.score.correct)
			$("#score-W").html(quiz.score.wrong)
			let audio = new Audio('static/assets/sounds/0-4 screen.mp3');
			setTimeout(function(){ 
				$('#correct' + lang).fadeOut(), 
				$('#wrong' + lang).fadeOut(),
				viewSelect('results-2-3' + lang),
				$(".scoreboard-container").fadeIn(),
				audio.play()
				}, 5000)
		} else if (quiz.score.correct > 3 && quiz.score.correct < 6) {
			$("#score-C").html(quiz.score.correct)
			$("#score-W").html(quiz.score.wrong)
			let audio = new Audio('static/assets/sounds/4-2 victory.mp3');
			setTimeout(function(){ 
				$('#correct' + lang).fadeOut(),
				$('#wrong' + lang).fadeOut(), 
				viewSelect('results-4-5' + lang),
				$(".scoreboard-container").fadeIn(),
				audio.play()
				}, 5000)
		} else {
			let audio = new Audio('static/assets/sounds/GoldenScreen.mp3');
			setTimeout(function(){ 
				$('#correct' + lang).fadeOut(), 
				viewSelect('results-6' + lang),
				audio.play()
				}, 5000)
		} 
	} else {
		setTimeout(function(){ 
			$('#wrong' + lang).fadeOut(),
			$('#correct' + lang).fadeOut(), 
			viewSelect(mode)}, 5000)
	}
    
}

function resetGame() {
	$(".scoreboard-container").hide()
	let audio = new Audio('static/assets/sounds/VerlassenButtonSound.mp3');
	audio.play()
    quiz.activeQuizes = quizArray.map(q => q),
    quiz.score.correct = 0,
    quiz.score.wrong = 0
    quiz.history = []
}

