(function () {
  if (typeof Hanoi === "undefined") {
    window.Hanoi = {};
  }

  var View = window.Hanoi.View = function (game, $el) {
    this.game = game;
    this.$towers = $el;
    this.setupTowers();
    this.bindListeners();
    this.$selectedTower = null;
  };

  View.prototype.setupTowers = function () {
    for (var i = 0; i < 3; i++) {
      var $pileContainer = $('<div>').addClass('pile-container').appendTo('.container').attr('id', i);
      var $pile = $('<div>').addClass('pile').appendTo($pileContainer);
    }
    var $first = $('.pile-container').first();
    var $large = $('<div>').addClass('disk').addClass('large').attr('size', 3).appendTo($first);
    var $medium = $('<div>').addClass('disk').addClass('medium').attr('size', 2).appendTo($first);
    var $small = $('<div>').addClass('disk').addClass('small').attr('size', 1).appendTo($first);
  };

  View.prototype.bindListeners = function () {
    var that = this;
    this.$towers.find('.pile-container').on('click', function (event) {
      that.clickTower($(event.currentTarget));
    });
  };

  View.prototype.clickTower = function ($tower) {
    if (this.$selectedTower) {

      var $movingDisk = this.$selectedTower.children('.disk:last-child');

      if (this.game.isValidMove(this.$selectedTower.attr('id'), $tower.attr('id'))) {
        this.game.move(this.$selectedTower.attr('id'), $tower.attr('id'));
        $movingDisk.detach().appendTo($tower);
        $movingDisk.removeClass('selected');
        if (this.game.isWon()) {
          $('<h1>').css("text-decoration", "underline").text("A Winner Is You!")
            .appendTo('.container');
          $('.pile-container').off('click');
        }
      } else {
        alert('Invalid move!');
        $movingDisk.removeClass('selected');
      }
      this.$selectedTower = null;
    } else {

      var $selected = $tower.children('.disk:last-child');
      console.log($selected);
      if ($selected.length === 0) {
        alert("There is no disk!");

      } else {
        this.$selectedTower = $tower;
        $selected.addClass('selected');
      }
    }
  };

  View.prototype.render = function() {

  };

})();
