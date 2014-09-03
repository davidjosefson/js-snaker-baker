//TODO: Add random "apples" on the board
//TODO: [x]Game over when hitting wall
//TODO: Fix the issue when pressing two keys too fast so that the snake doesn't continue backwards on the same axis. Maybe add a funtion to check so that one head is always drawn before letting the direction change again. Only let the direction change once every cycle! Or maybe register two directional changes, but draw one head and then change the direction (so you can do quick moves)!
//TODO: Fix board design
//TODO: Add nicer fonts
//TODO: Fix start game message design
//TODO: Fix game over message design
//TODO: [x]Make the snake move!
//TODO: [x]Game over when hitting tail
//TODO: [x]När man ändrar direction så ska den ta bort den nya intervallen och skapa en ny
//TODO: [x]Om man klickar på en knapp i "samma" riktning ska den ignorera detta (så att man inte kan speeda upp snaken)
//TODO: [x] After game over, the pause-function doesn't work - it seems to rerun the space-press (or just the switch-case). Next game over the pause works fine.. Investigate.
//TODO: [x]Make the snake tail disappear
//TODO: [x]Create some kind of Game over view

/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */
(function() {
    var START_DIRECTION = "right";
    var SNAKE_START_LENGTH = 5;     //How long the snake is allowed to grow when starting the game
    var SNAKESPEED = 100;
    var TILE_PX = 7;                //Number of pixels each tile consists of
    
    var LARGE_BOARD_SIDE = 75;    //Number of tiles on one side of the large hidden board (surrounding the small starting board)
    var LARGE_BOARD_SIDE_PX = LARGE_BOARD_SIDE*TILE_PX;
    
    var SMALL_BOARD_START_XPOS = 30;      //X-coordinate where the small board should start
    var SMALL_BOARD_START_YPOS = 35;      //Y-coordinate where the small board should start
    var SMALL_BOARD_END_XPOS = 60;      //X-coordinate where the small board should start
    var SMALL_BOARD_END_YPOS = 65;      //Y-coordinate where the small board should start
    
    var gameBoard;
    var snake = [];
    var direction = START_DIRECTION;
    var snakeLengthLimit = SNAKE_START_LENGTH;
    var myInterval;
    var appleCounter = 0;
    
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
        
        //Reset constants
        isGameOver = false;
        isGameStarted = false;
        
        //Reset and create a gameboard grid with tiles (no snakes yet)
        //createGameBoard(LARGE_BOARD_SIDE, SMALL_BOARD_START_XPOS, SMALL_BOARD_START_YPOS, SMALL_BOARD_END_XPOS, SMALL_BOARD_END_YPOS);
        gameBoard = new GameBoard(LARGE_BOARD_SIDE, SMALL_BOARD_START_XPOS, SMALL_BOARD_START_YPOS, SMALL_BOARD_END_XPOS, SMALL_BOARD_END_YPOS);
        
        //Add snake head to the snake array
        createSnake();
        
        //Add apple to game board
        gameBoard.addRandomApple("apple");
        
        //Read the snake array and updates the gameboard grid
        updateGameBoard();
    }
    
    function initilizeGUI() {
        drawGUI();
        displayStartGameMessage();
    }
    
    function createSnake() {
        //Resets the snake if it already exist
        if(snake.length > 0) {
            snake = [];
        }
        
        //Sets coordinates for the snake head relative to the small board size    
        var xPos = Math.floor(SMALL_BOARD_START_XPOS + (SMALL_BOARD_END_XPOS-SMALL_BOARD_START_XPOS)/4); //Start a quarter from left border
        var yPos = Math.floor(SMALL_BOARD_START_YPOS + (SMALL_BOARD_END_YPOS-SMALL_BOARD_START_YPOS)/2); //Start in the middle on the y-axis    
        
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
        //Loop through the game board and reset all snake flags
        gameBoard.resetTiles("snake", "smallBoard");
        
        //Check the snake array and set the corresponding board tile flags to "snake"
        gameBoard.syncSnakeArrayWithBoard();
    }
        
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    function drawGUI() {
        var canvas = document.getElementById('snakeBoard');
        var context = canvas.getContext("2d");
        
        //Set the canvas to the same size as the board
        canvas.height = LARGE_BOARD_SIDE_PX;
        canvas.width = LARGE_BOARD_SIDE_PX;
        
        //Draw the tiles
        var xPixels;
        var yPixels;
        
        for(var i = 0; i < gameBoard.boardSize("y"); i++) {
            for(var j = 0; j < gameBoard.boardSize("x"); j++){
                //Set startpixels
                xPixels = i * TILE_PX;
                yPixels = LARGE_BOARD_SIDE_PX - TILE_PX - j * TILE_PX;                    

                //Different colors for different types of tiles 
                switch (gameBoard.checkTileFlag(i, j)) {
                    case "smallBoard":
                        context.fillStyle = "#98D1AD";
                        context.fillRect(xPixels, yPixels, TILE_PX, TILE_PX);
                        break;
                    case "snake":
                        context.fillStyle = "#D891A8";
                        context.fillRect(xPixels, yPixels, TILE_PX, TILE_PX);
                        break;
                    case "apple":
                        context.fillStyle = "#eaff00";
                        context.fillRect(xPixels, yPixels, TILE_PX, TILE_PX);
                        break;
                    case "blueApple":
                        context.fillStyle = "#6e7ad3";
                        context.fillRect(xPixels, yPixels, TILE_PX, TILE_PX);
                        break;                            
                    //For debugging
                    case "largeBoard":
                        context.fillStyle = "#a398d1";
                        context.fillRect(xPixels, yPixels, TILE_PX, TILE_PX);
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
            
            checkCollision();
                        
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
                xPos = currentHeadXpos - 1;
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

        addHeadToArray(xPos, yPos);
    }
    
    function checkCollision() {
        switch (gameBoard.checkTileFlag(snake[0].xPos, snake[0].yPos)){
            case "largeBoard":
            case "snake":
                gameOver();   
                break;
            case "apple":
                //The snake should grow
                snakeLengthLimit++;
                
                //Adds new apple (every 5th apple should be blue)
                if(appleCounter % 2 === 0) {
                    gameBoard.addRandomApple("blueApple");    
                }
                else {
                    gameBoard.addRandomApple("apple");
                }
                
                //Adds one to the apple counter
                appleCounter++;
                break;
            case "blueApple":
                //The snake should grow
                snakeLengthLimit++;
                
                //Adds new apple (every 5th apple should be blue)
                if(appleCounter % 2 === 0) {
                    gameBoard.addRandomApple("blueApple");    
                }
                else {
                    gameBoard.addRandomApple("apple");
                }
                
                //Adds one to the apple counter
                appleCounter++;
                
                //ADD CODE TO LET THE SNAKE GO THROUGH THE WALL FOR A NUMBER OF SECONDS!
                
                break;
                
        }   
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
    
    function GameBoard(largeBoardSize, smallBoardStartX, smallBoardStartY, smallBoardEndX, smallBoardEndY) {
        var boardArray = [];
        var appleExist = false;
        
        // - CREATE THE BOARD -\\
        //X-coordinates
        for(var x = 0; x < largeBoardSize; x++){
            //Creates an array at position y in the first array
            boardArray[x] = [];
            var tempTile;            
            
            //Y-coordinates
            for(var y = 0; y < largeBoardSize; y++) {
                //Creates a smallBoard-tile if the coordinates matches the small board parameters
                if((x >= smallBoardStartX) && (x <= smallBoardEndX) && (y >= smallBoardStartY) && (y <= smallBoardEndY)) {    
                    tempTile = new Tile(x, y, "smallBoard");
                }
                //..otherwise it should create a largeBoard-tile
                else {
                    tempTile = new Tile(x, y, "largeBoard");
                }
                //Add the tile to the board array
                boardArray[x][y] = tempTile;
            }
        }
        
        //FUNCTIONS
        //Check the flag of a certain tile
        this.checkTileFlag = function(xPos, yPos) {
            if(xPos < boardArray.length && yPos < boardArray[xPos].length) {
                return boardArray[xPos][yPos].flag;
            }
            else {
                return false;
            }
        };
        
        //Returns the size of the board
        this.boardSize = function(axis) {
            if(axis == "x") {
                return boardArray.length;
            }
            else if(axis == "y") {
                return boardArray[0].length;
            }
        };
        
        //Set a tile flag
        this.setTileBoardFlag = function(xPos, yPos, boardType) {
            if(boardType == "largeGameBoard" || boardType == "smallGameBoard") {
                boardArray[xPos][yPos].flag = boardType;
                return true;
            }
            else {
                return false;
            }
        };
        
        //Adds an apple on a random "smallBoard" tile (empty tile)
        this.addRandomApple = function(appleType) {
            if(appleType == "apple" || appleType == "blueApple") {
                var randomXpos;
                var randomYpos;
                var emptyTileFound = false;

                while(!emptyTileFound){
                    randomXpos = getRandomInt(0, this.boardSize("x"));
                    randomYpos = getRandomInt(0, this.boardSize("y"));

                    if(boardArray[randomXpos][randomYpos].flag == "smallBoard"){
                        emptyTileFound = true;
                    }
                }

                boardArray[randomXpos][randomYpos].flag = appleType;
                appleExist = true;
                return true;
            }
            else {
                return false;
            }
        };
        
        //Check if apple exists on the board, if so, return true
        this.appleExist = function() {
            if(appleExist) {
                return true;
            }
            else {
                return false;
            }
        };
        
        //Loop through the game board and reset all flags of a certain type
        this.resetTiles = function(flagToReset, flagToSet) {
            for(var i = 0; i < boardArray.length; i++) {
                for(var j = 0; j < boardArray[i].length; j++){
                    if(boardArray[i][j].flag == flagToReset) {
                        boardArray[i][j].flag = flagToSet;
                    }
                }
            }
        };
        
        //Loop through the snake array and change the corresponding tiles on the gameboard
        this.syncSnakeArrayWithBoard = function() {
            for(var i = 0; i < snake.length; i++) {
                boardArray[snake[i].xPos][snake[i].yPos].flag = "snake";
            }
        };
    }
    
})();   

