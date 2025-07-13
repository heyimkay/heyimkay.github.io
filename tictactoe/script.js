const PLAYER_TOKEN = 'X';
const COMPUTER_TOKEN = 'Y';

$(document).ready(function() {
    const grid = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    let wins = 0;
    let losses = 0;
    let ties = 0;

    function updateScoreboard() {
        $('#wins').text(wins);
        $('#losses').text(losses);
        $('#ties').text(ties);
    }

    function isGameOver(gridToCheck) {
        // check horizontal
        for (var i = 0; i < 3; i++) {
            if (gridToCheck[i][0] !== ' ' &&
                gridToCheck[i][0] === gridToCheck[i][1] &&
                gridToCheck[i][0] === gridToCheck[i][2]) {
                return gridToCheck[i][0];
            }
        }
        // check vertical
        for (var j = 0; j < 3; j++) {
            if (gridToCheck[0][j] !== ' ' &&
                gridToCheck[0][j] === gridToCheck[1][j] &&
                gridToCheck[0][j] === gridToCheck[2][j]) {
                return gridToCheck[0][j];
            }
        }
        // check diagonal - top left to bottom right
        if (gridToCheck[0][0] !== ' ' &&
            gridToCheck[0][0] === gridToCheck[1][1] &&
            gridToCheck[0][0] === gridToCheck[2][2]) {
            return gridToCheck[0][0];
        }
        // check diagonal - bottom left to top right
        if (gridToCheck[2][0] !== ' ' &&
            gridToCheck[2][0] === gridToCheck[1][1] &&
            gridToCheck[2][0] === gridToCheck[0][2]) {
            return gridToCheck[2][0];
        }
        // check for empty spaces (game not over)
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (gridToCheck[i][j] === ' ') {
                    return false;
                }
            }
        }
        // tie
        return null;
    }

    function minmax(newGrid, depth, player) {
        const gameState = isGameOver(newGrid);

        if (gameState === false) {
            const values = [];
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    const gridCopy = _.cloneDeep(newGrid);
                    if (gridCopy[i][j] !== ' ') continue;
                    gridCopy[i][j] = player;
                    const value = minmax(gridCopy, depth + 1, (player === PLAYER_TOKEN) ? COMPUTER_TOKEN : PLAYER_TOKEN);
                    values.push({
                        cost: value,
                        cell: { i: i, j: j }
                    });
                }
            }
            if (player === COMPUTER_TOKEN) {
                const max = _.maxBy(values, (v) => v.cost);
                if (depth === 0) {
                    return max.cell;
                } else {
                    return max.cost;
                }
            } else {
                const min = _.minBy(values, (v) => v.cost);
                if (depth === 0) {
                    return min.cell;
                } else {
                    return min.cost;
                }
            }
        } else if (gameState === null) {
            return 0;
        } else if (gameState === PLAYER_TOKEN) {
            return depth - 10;
        } else if (gameState === COMPUTER_TOKEN) {
            return 10 - depth;
        }
    }

    function moveCOMPUTER() {
        // 50% chance to make a random move
        if (Math.random() < 0.5) {
            const emptyCells = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[i][j] === ' ') {
                        emptyCells.push({ i: i, j: j });
                    }
                }
            }
            if (emptyCells.length > 0) {
                return _.sample(emptyCells);
            }
        }
        // Otherwise use minimax
        return minmax(grid, 0, COMPUTER_TOKEN);
    }

    $('.column').click(function() {
        const $this = $(this);
        const i = $this.data('i');
        const j = $this.data('j');

        if (grid[i][j] !== ' ') return; // prevent overwriting

        // Show strawberry token
        $this.html('<div class="token strawberry"></div>');
        grid[i][j] = PLAYER_TOKEN;

        let gameState = isGameOver(grid);
        if (gameState !== false) {
            if (gameState === PLAYER_TOKEN) {
                wins++;
                alert('You win!');
            } else if (gameState === COMPUTER_TOKEN) {
                losses++;
                alert('Computer wins!');
            } else {
                ties++;
                alert('Tie game!');
            }
            updateScoreboard();
            return;
        }

        // Delay before computer moves
        setTimeout(function() {
            const move = moveCOMPUTER();
            if (move) {
                grid[move.i][move.j] = COMPUTER_TOKEN;
                $('.column[data-i=' + move.i + '][data-j=' + move.j + ']').html('<div class="token whip"></div>');
            }

            gameState = isGameOver(grid);
            if (gameState !== false) {
                if (gameState === PLAYER_TOKEN) {
                    wins++;
                    alert('You win!');
                } else if (gameState === COMPUTER_TOKEN) {
                    losses++;
                    alert('Computer wins!');
                } else {
                    ties++;
                    alert('Tie game!');
                }
                updateScoreboard();
            }
        }, 250); // 250ms pause
    });

    $('#restart').click(function() {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                grid[i][j] = ' ';
                $('.column[data-i=' + i + '][data-j=' + j + ']').html(' ');
            }
        }
    });
});
