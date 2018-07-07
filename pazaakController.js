var app = angular.module('pazaakApp', []);
app.controller('pazaakCtrl', function($scope) {

    $scope.resetGame = function() {
        $scope.playerBoard = [
            [
                {type: null, value: null},
                {type: null, value: null},
                {type: null, value: null}
            ],
            [
                {type: null, value: null},
                {type: null, value: null},
                {type: null, value: null}
            ],
            [
                {type: null, value: null},
                {type: null, value: null},
                {type: null, value: null}
            ]
        ]
        $scope.opponentBoard = [
            [
                {type: null, value: null},
                {type: null, value: null},
                {type: null, value: null}
            ],
            [
                {type: null, value: null},
                {type: null, value: null},
                {type: null, value: null}
            ],
            [
                {type: null, value: null},
                {type: null, value: null},
                {type: null, value: null}
            ]
        ]
        $scope.player.score = 0;
        $scope.opponent.score = 0;
        $scope.player.stand = false;
        $scope.opponent.stand = false;
        $scope.player.bust = false;
        $scope.opponent.bust = false;
        $scope.player.cardsPlayed = 0;
        $scope.opponent.cardsPlayed = 0;
        $scope.gameDone = false;
        initPlayerTurn();
    }

    $scope.resetMatch = function() {
        $scope.player = {
            name: "Jack",
            score: 0,
            cardsPlayed: 0,
            stand: false,
            playedTurn: false,
            bust: false,
            wins: 0
        }
        $scope.opponent = {
            name: "Shadow Jack",
            score: 0,
            cardsPlayed: 0,
            stand: false,
            playedTurn: false,
            bust: false,
            wins: 0
        }
        $scope.playerHand = [
            randPlayerCard(),
            randPlayerCard(),
            randPlayerCard(),
            randPlayerCard()
        ]
        $scope.opponentHand = [
            randPlayerCard(),
            randPlayerCard(),
            randPlayerCard(),
            randPlayerCard()
        ]
        $scope.matchDone = false;
        $scope.resetGame();
    }
    var init = function() {
        $scope.resetMatch();
        $scope.gameDone = false;
        $scope.matchDone = false;
    }

    
    $scope.endTurn = function() {
        $scope.player.playedTurn = false;
        if ($scope.player.score > 20) {
            $scope.player.bust = true;
            endGame();
        } else if ($scope.opponent.stand) {
            initPlayerTurn();
        } else {
            opponentTurn();
        }
    }
    
    $scope.stand = function() {
        $scope.player.stand = true;
        $scope.player.playedTurn = false;
        if ($scope.player.score > 20) {
            $scope.player.bust = true;
            endGame();
        } else if ($scope.opponent.stand) {
            endGame();
        } else {
            opponentTurn();
        }
    }

    function useCardCheck(card) {
        var score = $scope.opponent.score;
        var newScore = score + card.value;
        if ((newScore == 19 && card.value != -1) || newScore == 20) {
            return true;
        } else if (score > 20 && newScore <= 20 && newScore > $scope.player.score) {
            return true;
        }
    }

    function opponentTurn() {
        dealBoardCard("opponent");
        var cardToPlay = null;
        var score = $scope.opponent.score;
        angular.forEach($scope.opponentHand, function (card, index) {
            if (card != null && cardToPlay == null) {
                if (useCardCheck(card)) {
                    cardToPlay = card;
                    $scope.opponentHand[index] = null;
                }
                if (card.type == 'pm') {
                    card.value *= -1;
                    card.type = 'mp';
                    if (useCardCheck(card)) {
                        cardToPlay = card;
                        $scope.opponentHand[index] = null;
                    } else {
                        card.value *= -1;
                        card.type = 'pm';
                    }
                }
            }
        });
        if (cardToPlay != null) {
            addBoardCard("opponent", cardToPlay);
            $scope.opponent.stand = true;
        } 
        if ($scope.opponent.score > 20) {
            $scope.opponent.bust = true;
            endGame();
        } else {
            if ($scope.opponent.score == 20 || ($scope.player.score < score && $scope.player.stand)) {
                $scope.opponent.stand = true;
            } 
            if ($scope.player.stand && !$scope.opponent.stand) {
                opponentTurn();
            } else if ($scope.player.stand && $scope.opponent.stand) {
                endGame();
            } else {
                initPlayerTurn();
            }
        }
    }

    function initPlayerTurn() {
        dealBoardCard("player");
        if ($scope.player.score == 20) {
            $scope.stand();
        }
    }

    function endGame() {
        if ($scope.opponent.bust || ($scope.player.score > $scope.opponent.score && !$scope.player.bust)) {
            $scope.player.wins++;
        } else if ($scope.player.bust || ($scope.player.score < $scope.opponent.score && !$scope.opponent.bust)) {
            $scope.opponent.wins++;
        }
        if ($scope.opponent.wins == 3 || $scope.player.wins == 3) {
            $scope.matchDone = true;
        } else {
            $scope.gameDone = true;
        }
    }

    $scope.winCount = function(side, index) {
        if (side == "player" && $scope.player.wins >= index) {
            return "assets/yeswin.png";
        } else if (side == "opponent" && $scope.opponent.wins >= index) {
            return "assets/yeswin.png";
        } else {
            return "assets/nowin.png";
        }
    }

    function randVal(max) {
        return Math.floor((Math.random() * max) + 1); 
    }

    $scope.getCardImage = function(card) {
        return "assets/" + card.type + card.value + ".jpg";
    }
    $scope.flipCard = function(index) {
        $scope.playerHand[index].value *= -1;
        if ($scope.playerHand[index].type == 'pm') {
            $scope.playerHand[index].type = 'mp';
        } else {
            $scope.playerHand[index].type = 'pm';
        }
    }

    function addBoardCard(board, card) {
        if (board == 'player' && $scope.player.cardsPlayed < 9) {
            var col = Math.floor($scope.player.cardsPlayed / 3);
            var row = $scope.player.cardsPlayed % 3;
            $scope.playerBoard[row][col] = card;
            $scope.player.score += card.value;
            $scope.player.cardsPlayed++;
        } else if ($scope.opponent.cardsPlayed < 9){
            var col = Math.floor($scope.opponent.cardsPlayed / 3);
            var row = $scope.opponent.cardsPlayed % 3;
            $scope.opponentBoard[row][col] = card;
            $scope.opponent.score += card.value;
            $scope.opponent.cardsPlayed++;
        }
    }

    function dealBoardCard(board) {
        addBoardCard(board, {type: "main", value: randVal(10)});
    };

    function randPlayerCard() {
        var type = randVal(3);
        if (type == 1) {
            return {type: "plus", value: randVal(6)};
        } else if (type == 2) {
            return {type: "minus", value: -1 * randVal(6)};
        } else {
            return {type: "pm", value: randVal(6)};
        }
    }

    $scope.playCard = function(index) {
        if (!$scope.player.playedTurn) {
            $scope.player.playedTurn = true;
            addBoardCard("player", $scope.playerHand[index]);
            $scope.playerHand[index] = null;
            if ($scope.player.score == 20) {
                $scope.stand();
            }
        }
    }
    init();
});
