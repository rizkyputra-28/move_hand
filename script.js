let num1, num2;
let score = 0;
let time = 30;
let timer;

function newQuestion(){

    num1 = Math.floor(Math.random()*10)+1;
    num2 = Math.floor(Math.random()*10)+1;

    document.getElementById("question").innerText = num1 + " + " + num2;

    document.getElementById("answer").value = "";
}

function checkAnswer(){

    let user = Number(document.getElementById("answer").value);

    let result = document.getElementById("result");

    if(user === num1 + num2){

        score++;

        result.innerText = "Benar!";
        result.className = "correct";

    }else{

        result.innerText = "Salah!";
        result.className = "wrong";

    }

    document.getElementById("score").innerText = "Skor: " + score;

    newQuestion();
}

function startTimer(){

    timer = setInterval(function(){

        time--;

        document.getElementById("timer").innerText = "Waktu: " + time;

        if(time <= 0){

            clearInterval(timer);

            alert("Game selesai! Skor kamu: " + score);

            location.reload();

        }

    },1000);
}

newQuestion();
startTimer();