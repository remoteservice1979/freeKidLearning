const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentEmp")) || [];

highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");

studentList.innerHTML = currentUser
  .map(user => {
    return `<li class="high-score">${user.username} - ${user.useremail}</li>`;
  })
  .join("");
