function Game () {
  this.towers = [[3, 2, 1], [], []];
};

Game.prototype.isValidMove = function (startTowerIdx, endTowerIdx) {
  var startTower = this.towers[startTowerIdx];
  var endTower = this.towers[endTowerIdx];

  if (startTower.length === 0) {
    return false;
  } else if (endTower.length == 0) {
    return true;
  } else {
    var topStartDisc = startTower[startTower.length - 1];
    var topEndDisc = endTower[endTower.length - 1];
    return topStartDisc < topEndDisc;
  }
};

Game.prototype.isWon = function () {
  // move all the discs to the last or second tower
  return (this.towers[2].length == 3) || (this.towers[1].length == 3);
};

Game.prototype.move = function (startTowerIdx, endTowerIdx) {
  if (this.isValidMove(startTowerIdx, endTowerIdx)) {
    this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
    return true;
  } else {
    return false;
  }
};
funtion setUser () {
  var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
         var msg; 
        function winner() {
		var email =  localStorage.getItem("UserName");
         db.transaction(function (tx) { 
            tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)'); 
            tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, email)'); 
           
            msg = '<p>Who is the Winner</p>'; 
            document.querySelector('#status').innerHTML =  msg; 
         })
	}

         db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
               var len = results.rows.length, i; 
               msg = "<p>Found rows: " + len + "</p>"; 
               document.querySelector('#status').innerHTML +=  msg; 
      
               for (i = 0; i < len; i++) { 
                  msg = "<p><b>" + results.rows.item(i).log + "</b></p>"; 
                  document.querySelector('#status').innerHTML +=  msg; 
               } 
            }, null); 
         }); 
}
Game.prototype.print = function () {
  console.log(JSON.stringify(this.towers));
};

Game.prototype.promptMove = function (reader, callback) {
  this.print();
  reader.question("Enter a starting tower: ", function (start) {
    var startTowerIdx = parseInt(start);
    reader.question("Enter an ending tower: ", function (end) {
      var endTowerIdx = parseInt(end);
      callback(startTowerIdx, endTowerIdx)
    });
  });
};

Game.prototype.run = function (reader, gameCompletionCallback) {
  this.promptMove(reader, (function (startTowerIdx, endTowerIdx) {
    if (!this.move(startTowerIdx, endTowerIdx)) {
      console.log("Invalid move!");
    }

    if (!this.isWon()) {
      // Continue to play!
      this.run(reader, gameCompletionCallback);
    } else {
      this.print();
      console.log("You win!");
      setUser();
      gameCompletionCallback();
    }
  }).bind(this));
};

module.exports = Game;
