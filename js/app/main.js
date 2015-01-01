//TODO: [x]Make the "walls" disappear on the smallBoard, and let the snake create new paths for some number of seconds. CheckCollision()-function -> "blueApple"-case.
//TODO: [x]Fix the issue when pressing two keys too fast so that the snake doesn't continue backwards on the same axis. Maybe add a funtion to check so that one head is always drawn before letting the direction change again. Only let the direction change once every cycle! Or maybe register two directional changes, but draw one head and then change the direction (so you can do quick moves)!
//TODO: Fix what happens when reaching the end of the big board
//TODO: Fix that eating two blue apples will reset the wallsGoneCounter, now it won't prolong the wallsGone-mode
//TODO: Fix board design
//TODO: Add a photobackground on the big board with a white box on top which will be set to transparent when the snake moves over it
//TODO: Add a Cage-head which will be randomly placed on the big board and coordinates to one of the eyes
//TODO: Add nicer fonts
//TODO: Fix start game message design
//TODO: Fix game over message design
//TODO: Problem: an apple can appear on the new paths (big board). Solution: add countdown for apples and respawn them in another place!
//TODO: [x]Make the snake move!
//TODO: [x]Game over when hitting tail
//TODO: [x]När man ändrar direction så ska den ta bort den nya intervallen och skapa en ny
//TODO: [x]Om man klickar på en knapp i "samma" riktning ska den ignorera detta (så att man inte kan speeda upp snaken)
//TODO: [x] After game over, the pause-function doesn't work - it seems to rerun the space-press (or just the switch-case). Next game over the pause works fine.. Investigate.
//TODO: [x]Make the snake tail disappear
//TODO: [x]Create some kind of Game over view
//TODO: [x]Add random "apples" on the board
//TODO: [x]Game over when hitting wall

/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false, curly: false */
/*global $:false, define:false*/


define(["jquery", "./snakehead", "./tile", "./gameboard"], function($, SnakeHead, Tile, GameBoard) {
//    (function() {
    var START_DIRECTION = "right";
    var SNAKE_START_LENGTH = 5;     //How long the snake is allowed to grow when starting the game
    var SNAKESPEED = 50;
    var TILE_PX = 7;                //Number of pixels each tile consists of
    
    var LARGE_BOARD_SIDE = 75;    //Number of tiles on one side of the large hidden board (surrounding the small starting board)
    var LARGE_BOARD_SIDE_PX = LARGE_BOARD_SIDE*TILE_PX;
    
    var SMALL_BOARD_START_XPOS = 30;      //X-coordinate where the small board should start
    var SMALL_BOARD_START_YPOS = 35;      //Y-coordinate where the small board should start
    var SMALL_BOARD_END_XPOS = 60;      //X-coordinate where the small board should start
    var SMALL_BOARD_END_YPOS = 65;      //Y-coordinate where the small board should start
    var LENGTH_OF_WALLS_GONE = 150;
    
    var gameBoard;
    var snake = [];
    var direction = START_DIRECTION;
    var snakeLengthLimit = SNAKE_START_LENGTH;
    var myInterval;
    var appleCounter = 0;
    var wallsGone = false;
    var wallsGoneCounter = 0;
    
    var isGameStarted = false;
    var isGameOver = false;
    var isPaused = true;
    
    //To fix a bug where the user is to fast when switching directions, that the snake goes backwards into itself
    var prevDirection = START_DIRECTION;  
    
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
        
        //Reset constants and snake
        isGameOver = false;
        isGameStarted = false;
        wallsGone = false;
        snake = [];
        
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
        //Sets coordinates for the snake head relative to the small board size    
        var xPosSnakeHead = Math.floor(SMALL_BOARD_START_XPOS + (SMALL_BOARD_END_XPOS-SMALL_BOARD_START_XPOS)/4); //Start a quarter from left border
        var yPosSnakeHead = Math.floor(SMALL_BOARD_START_YPOS + (SMALL_BOARD_END_YPOS-SMALL_BOARD_START_YPOS)/2); //Start in the middle on the y-axis    
        
        //Create a snake head and add to the snake array
        var firstSnakeHead = new SnakeHead(xPosSnakeHead, yPosSnakeHead);
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
                        if(!snakeDirectionOnXAxis()) 
                            direction = "left";
                        break;

                    //UP
                    case 38:
                        if(!snakeDirectionOnYAxis()) 
                            direction = "up";
                        break;                

                    //RIGHT
                    case 39: 
                        if(!snakeDirectionOnXAxis()) 
                            direction = "right";
                        break;
                    //DOWN
                    case 40:
                        if(!snakeDirectionOnYAxis()) {
                            direction = "down";
                        }
                        break;
                    //SPACE
                    case 32:
                        if(isPaused)
                            moveSnake();
                        else 
                            pauseSnake();
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
    
    //Checks if the snake moving on the X-axis now and previously (to fix a bug where it was able to descend into itself and die)
    function snakeDirectionOnXAxis() {
        return ((direction == "right") || (direction == "left") || (prevDirection == "right") || (prevDirection == "left"));
    } 
    
    //Checks if the snake moving on the Y-axis now and previously (to fix a bug where it was able to descend into itself and die)
    function snakeDirectionOnYAxis() {
        return ((direction == "up") || (direction == "down") || (prevDirection == "up") || (prevDirection == "down"));
    } 
    
    //TILE OBJECT CONSTRUCTOR

    
    function updateGameBoard() {
        //Reset current snake tiles on the board
        gameBoard.resetTiles("snake", "smallBoard");
        
        //Set the new snake tiles from the snake array
        gameBoard.syncBoardWithSnakeArray(snake);
    }
        
    function drawGUI() {
        var canvas = document.getElementById('snakeBoard');
        var context = canvas.getContext("2d");
        var snakeColor;
        
        //Set the canvas to the same size as the board
        canvas.height = LARGE_BOARD_SIDE_PX;
        canvas.width = LARGE_BOARD_SIDE_PX;
        
        //Draw the tiles
        var xPixels;
        var yPixels;
        
        if(wallsGoneCounter === 0)
            snakeColor = "#D891A8";
        else if(wallsGoneCounter > 0 && wallsGoneCounter < LENGTH_OF_WALLS_GONE*0.4)
            snakeColor = "#0bf741";
        else if(wallsGoneCounter < LENGTH_OF_WALLS_GONE*0.4)
            snakeColor = "#8bfc07";
        else if(wallsGoneCounter < LENGTH_OF_WALLS_GONE*0.6)
            snakeColor = "#e9fc07";
        else if(wallsGoneCounter < LENGTH_OF_WALLS_GONE*0.8)
            snakeColor = "#fc9e07";
        else// if(wallsGoneCounter < LENGTH_OF_WALLS_GONE*0.9)
            snakeColor = "#fc3607";
        
        if(isGameOver)
            snakeColor = "#000000";
        
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
                        context.fillStyle = snakeColor;
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
            
            if(snake.length > snakeLengthLimit) 
                removeSnakeTail();
            
            
            checkCollision();
                        
            if(wallsGone)
                wallsGoneCounter++;
            
            if(wallsGoneCounter >= LENGTH_OF_WALLS_GONE) {
                wallsGone = false;
                wallsGoneCounter = 0;
            }
            
            updateGameBoard();
            drawGUI();
            
            prevDirection = direction;
            
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
                if(!wallsGone) 
                    gameOver();    
                break;
            case "snake":
                gameOver();   
                break;
            case "apple":
                //The snake should grow
                snakeLengthLimit++;
                
                //Adds new apple (every 5th apple should be blue)
                if(appleCounter % 2 === 0) 
                    gameBoard.addRandomApple("blueApple");    
                
                else 
                    gameBoard.addRandomApple("apple");
                
                
                //Adds one to the apple counter
                appleCounter++;
                break;
            case "blueApple":
                //The snake should grow
                snakeLengthLimit++;
                
                //Adds new apple (every 5th apple should be blue)
                gameBoard.addRandomApple("apple");
                
                //Adds one to the apple counter
                appleCounter++;
                
                //ADD CODE TO LET THE SNAKE GO THROUGH THE WALL FOR A NUMBER OF SECONDS!
                wallsGone = true;
                
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
});   

