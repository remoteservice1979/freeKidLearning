function started(duration){
  
  var TotalSeconds = 300;
 var documentWidth  = $(document).width();
  var start          = Date.now();
  var intervalSetted = null;

function timer() {
  
                var diff = duration - (((Date.now() - start) / 1000) | 0);

                var seconds = (diff % 60) | 0;

                seconds         = seconds < 10 ? "0" + seconds : seconds;

                $('#timer').html("00:" + seconds);

                var progresBarWidth = (seconds * documentWidth / TotalSeconds);


                $('#progress').animate({
                    width: progresBarWidth + 'px'
                }, 1000);
                 if(seconds === "0-1" || seconds == "00" ) {
                  window.location.replace ="https://codingstar.netlify.app/jobquiz/quizappmaster/end.html";
                 }
                if (diff <= 0) {
                    clearInterval(intervalSetted);
                   window.location.replace ="https://codingstar.netlify.app/jobquiz/quizappmaster/end.html";
                }
             
  
            }

            timer();
            intervalSetted = setInterval(timer, 1000);
}

started(40);
