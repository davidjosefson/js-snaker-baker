//TODO: Make the snake move!
//TODO: Fix the issue when pressing two keys too fast so that the snake doesn't continue backwards on the same axis. Maybe add a funtion to check so that one head is always drawn before letting the direction change again. Only let the direction change once every cycle! Or maybe register two directional changes, but draw one head and then change the direction (so you can do quick moves)!
//TODO: Fix board design
//TODO: Add nicer fonts
//TODO: Fix start game message design
//TODO: Fix game over message design
//TODO: Game over when hitting tail
//TODO: Game over when hitting wall
//TODO: [x]När man ändrar direction så ska den ta bort den nya intervallen och skapa en ny
//TODO: [x]Om man klickar på en knapp i "samma" riktning ska den ignorera detta (så att man inte kan speeda upp snaken)
//TODO: [x] After game over, the pause-function doesn't work - it seems to rerun the space-press (or just the switch-case). Next game over the pause works fine.. Investigate.
//TODO: [x]Make the snake tail disappear
//TODO: [x]Create some kind of Game over view

/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */
(function() {
    var START_DIRECTION = "right";
    var SNAKE_START_LENGTH = 5;  //How long the snake is allowed to grow when starting the game
    var SNAKESPEED = 100;
    var TILE_PX = 7;             //Number of pixels each tile consists of
    var SNAKE_PX = TILE_PX;      //Same as the tile size
    var BOARD_SIDE = 50;         //Number of tiles on one side of the board
    var BOARD_SIDE_PX = BOARD_SIDE*TILE_PX;
    
    var gameBoard = [];
    var snake = [];
    var direction = START_DIRECTION;
    var snakeLengthLimit = SNAKE_START_LENGTH;
    var myInterval;
    
    var isGameStarted = false;
    var isGameOver = false;
    var isPaused = true;
    
    $(document).ready(function(){
        initializeGame();
        initilizeGUI();
        setKeyEvents();
    });

    function initializeGame() {
        //Set start direction
        direction = START_DIRECTION;
        
        //Set snake start length
        snakeLengthLimit = SNAKE_START_LENGTH;
        
        //Resets constants
        isGameOver = false;
        isGameStarted = false;
        
        //Resets and creates a gameboard grid with tiles (no snakes yet)
        createGameBoard(BOARD_SIDE);
        
        //Add snake head to the snake array
        createSnake();
        
        //Reads the snake array and updates the gameboard grid
        updateGameBoard();
    }
    
    function initilizeGUI() {
        drawGUI();
        displayStartGameMessage();
    }
    
    function createSnake() {
        if(snake.length > 0) {
            snake = [];
        }
        
        //Sets coordinates for the snake head relative to the board size
        var xPos = Math.floor(BOARD_SIDE/4);    //Start a quarter from the left border
        var yPos = Math.floor(BOARD_SIDE/2);    //Start in the middle on the y-axis    
        
        //Create a snake head
        var firstSnakeHead = new SnakeHead(xPos, yPos);
        
        //Add that snake head to the snake array
        snake.push(firstSnakeHead);
    }
    
    function setKeyEvents() {
        $(document).keydown(function(key){
            //Press any key to start the game
            if(!isGameStarted){
                if(key.which == 13) {
                    hideStartGameMessage();
                    startGame();
                }
            }
            //Press any key to remove game over message
            else if(isGameOver) {
                if(key.which == 13) {
                    hideGameOverMessage();
                    initializeGame();
                    initilizeGUI();
                }
            } 
            //Game started
            else {
                switch(key.which) {
                    //LEFT
                    case 37: 
                        if((direction != "right") && (direction != "left")){
                            direction = "left";
                        }
                        break;

                    //UP
                    case 38:
                        if((direction != "down") && (direction != "up")){
                            direction = "up";
                        }
                        break;                

                    //RIGHT
                    case 39: 
                        if((direction != "right") && (direction != "left")){
                            direction = "right";
                        }
                        break;
                    //DOWN
                    case 40:
                        if((direction != "down") && (direction != "up")) {
                            direction = "down";
                        }
                        break;
                    //SPACE
                    case 32:
                        if(isPaused){
                            moveSnake();
                        }
                        else {
                            pauseSnake();
                        }
                        break;
                    //A
                    case 65:
                        snakeLengthLimit++;
                        break;
                    //X
                    case 88:
                        gameOver();
                        break;
                }
            }
        });
    }
    
    //SNAKEHEAD OBJECT CONSTRUCTOR
    function SnakeHead(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
    
    //TILE OBJECT CONSTRUCTOR
    function Tile(xPos, yPos, flag) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.flag = flag;
    }
    
    function updateGameBoard() {
        //Reset all snake tiles in the game board array
        for(var i = 0; i < gameBoard.length; i++) {
            if(gameBoard[i].flag == "snake") {
                gameBoard[i].flag = "empty";
            }
        }
        
        //Loops through the snake array
        for(var j = 0; j < snake.length; j++) {
            //Loops through the game board array
            for(var k = 0; k < gameBoard.length; k++){
                //If the current snake coordinates equals those of the game board tile,
                //set the current game board tile flag to "snake"
                if((snake[j].xPos == gameBoard[k].xPos) && (snake[j].yPos == gameBoard[k].yPos)) {
                    gameBoard[k].flag = "snake";
                }
            }
        }
    }
    
    function drawGUI() {
        var canvas = document.getElementById('snakeBoard');
        var context = canvas.getContext("2d");
        
        //Set the canvas to the same size as the board
        canvas.height = BOARD_SIDE_PX;
        canvas.width = BOARD_SIDE_PX;
        
        //Set board color
        context.fillStyle = "#98D1AD";
        
        //Draw the board
        context.fillRect(0, 0, BOARD_SIDE_PX, BOARD_SIDE_PX);
        
        //Draw the tiles
        var xPixels;
        var yPixels;
        
        if(gameBoard.length !== 0) {
            for(var i = 0; i < gameBoard.length; i++) {
                switch (gameBoard[i].flag) {
                    case "snake":
                        xPixels = gameBoard[i].xPos * TILE_PX;
                        yPixels = BOARD_SIDE_PX - TILE_PX - gameBoard[i].yPos * TILE_PX;
                        context.fillStyle = "#D891A8";
                        context.fillRect(xPixels, yPixels, SNAKE_PX, SNAKE_PX);
                        break;
                }
            }
        }
        
    }
    
    function displayStartGameMessage() {
        $('#startGameMessage').css('display', 'block');    
    }
    
    function hideStartGameMessage() {
        $('#startGameMessage').css('display', 'none');
    }
    
    function displayGameOverMessage(){
        $('#gameOverMessage').css('display','block');
    }
    
    function hideGameOverMessage(){
        $('#gameOverMessage').css('display','none');
    }
    
    function startGame(){
        isGameStarted = true;
        moveSnake();
    }
    
    function moveSnake() {
        isPaused = false;
        clearInterval(myInterval);
        
        myInterval = setInterval(function(){
            addSnakeHead(direction);
            if(snake.length > snakeLengthLimit) {
                removeSnakeTail();
            }
            
            updateGameBoard();
            drawGUI();
            
        }, SNAKESPEED);
    }
    
    function gameOver(){
        clearInterval(myInterval);
        isGameOver = true;
        displayGameOverMessage();
    }

    function pauseSnake(){
        clearInterval(myInterval);
        isPaused = true;
    } 
    
    function addSnakeHead(direction) {
        var currentHeadXpos = snake[0].xPos;
        var currentHeadYpos = snake[0].yPos;
        var xPos;
        var yPos;

        switch(direction){
            case "left":
                xPos = currentHeadXpos - 1
                yPos = currentHeadYpos;
                break;
            case "up":
                xPos = currentHeadXpos;
                yPos = currentHeadYpos + 1;
                break;
            case "right":
                xPos = currentHeadXpos + 1;
                yPos = currentHeadYpos;
                break;
            case "down":
                xPos = currentHeadXpos;
                yPos = currentHeadYpos - 1;
                break;
        }
        
        //Check if the coordinates already exists in the snake array (if the snake has collided with itself)
        if(checkTailCollision(xPos, yPos)) {
            gameOver();
        }
        else {
            //Adds coordinates to the snake array
            addHeadToArray(xPos, yPos);
        }
    }
    
    function checkTailCollision(xPos, yPos) {
        if(snake.length > 0) {
            for(var i = 0; i < snake.length; i++) {
                if((snake[i].xPos == xPos) && (snake[i].yPos == yPos)){
                    return true;
                }
            }
        }
        return false;
    }
    
    function removeSnakeTail() {
        //Remove the last object from the snake array
        snake.pop();
    }

    //Function to add a new head to the array
    function addHeadToArray(xPos, yPos) {
        //Create a new body part with coordinates
        var snakeHead = new SnakeHead(xPos, yPos);
        
        //Adds the snake head object to the beginning of the array
        snake.unshift(snakeHead);
    }
    
    
    function createGameBoard(size) {    
        if(gameBoard.length > 0) {
            gameBoard = [];
        }
        
        var tile;
        for(var i = 0; i < size; i++) {
            for(var j = 0; j < size; j++) {
                tile = new Tile(j, i, "empty");
                gameBoard.push(tile);
            }
        }
    }

})();   

