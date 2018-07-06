var app = angular.module('pazaakApp', []);
app.controller('pazaakCtrl', function($scope) {

    $scope.player = {
        name: "Revan",
        score: 0,
        cardsPlayed: 0
    }
    $scope.opponent = {
        name: "jack",
        score: 0,
        cardsPlayed: 0
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

    function randPlayerCard() {
        var type = randVal(3);
        if (type == 1) {
            return {type: "plus", value: randVal(6)};
        } else if (type == 2) {
            return {type: "minus", value: randVal(6)};
        } else {
            return {type: "pm", value: randVal(6)};
        }
    }
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
    function randVal(max) {
        return Math.floor((Math.random() * max) + 1); 
    }
    $scope.addBoardCard = function(board) {
        if (board == 'player' && $scope.player.cardsPlayed < 9) {
            var col = Math.floor($scope.player.cardsPlayed / 3);
            var row = $scope.player.cardsPlayed % 3;
            var val = randVal(10);
            $scope.playerBoard[row][col] = {type: "main", value: val};
            $scope.player.score += val;
            $scope.player.cardsPlayed++;
        } else if ($scope.opponent.cardsPlayed < 9){
            var col = Math.floor($scope.opponent.cardsPlayed / 3);
            var row = $scope.opponent.cardsPlayed % 3;
            var val = randVal(10);
            $scope.opponentBoard[row][col] = {type: "main", value: val};
            $scope.opponent.score += val;
            $scope.opponent.cardsPlayed++;
        }
    };
});
