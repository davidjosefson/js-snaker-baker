//TODO: After game over, the pause-function doesn't work - it seems to rerun the space-press (or just the switch-case). Next game over the pause works fine.. Investigate.
//TODO: [x]Make the snake tail disappear
//TODO: Create some kind of Game over view
//TODO: Game over when hitting tail
//TODO: Game over when hitting wall
//TODO: [x]När man ändrar direction så ska den ta bort den nya intervallen och skapa en ny
//TODO: [x]Om man klickar på en knapp i "samma" riktning ska den ignorera detta (så att man inte kan speeda upp snaken)

/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */
(function() {
    var currentDirection;
    var currentXpos;
    var currentYpos;
    var myInterval;
    var pixelsToMove = 5;
    var snakeSpeed = 100;
    var paused = false;
    var snakeLengthLimit = 7;
    var snakeBodyArray = [];
    var gameStarted = false;
    
    $(document).ready(function(){
        $(document).keydown(function(){
            if(!gameStarted){
                hideStartGameMessage();
                hideGameOverMessage();
                startGame();
                gameStarted = true;
            }
        });
    });

    function hideStartGameMessage() {
        $('#startGameMessage').css('display', 'none');
    }
    
    function startGame(){
        gameStarted = true;
        paused = false;
        currentDirection = "right";
        currentXpos = 50;
        currentYpos = 50;
        
        moveSnake("right");
        
        $(document).keydown(function(key){
            if(gameStarted){
                switch(key.which) {
                    //LEFT
                    case 37: 
                        if((currentDirection != "right") && (currentDirection != "left")){
                            moveSnake("left");
                        }
                        break;

                    //UP
                    case 38:
                        if((currentDirection != "down") && (currentDirection != "up")){
                            moveSnake("up");
                        }
                        break;                

                    //RIGHT
                    case 39: 
                        if((currentDirection != "right") && (currentDirection != "left")){
                            moveSnake("right");
                        }
                        break;
                    //DOWN
                    case 40:
                        if((currentDirection != "down") && (currentDirection != "up")) {
                            moveSnake("down");
                        }
                        break;
                    //SPACE
                    case 32:
                        if(paused){
                            moveSnake(currentDirection);
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
    
    function gameOver(){
        //pauseSnake();
        gameStarted = false;
        resetGame();
        displayGameOverMessage();
        
        /*$(document).keydown(function(){
            if(!gameStarted){
                hideGameOverMessage();
                startGame();
            }
        });*/
    }
    
    function resetGame() {
        $('.snakeHead').remove();
        snakeBodyArray = [];
        clearInterval(myInterval);
    }
    
    function displayGameOverMessage(){
        $('#gameOverMessage').css('display','block');
    }
    
    function hideGameOverMessage(){
        $('#gameOverMessage').css('display','none');
    }
    
    function pauseSnake(){
        clearInterval(myInterval);
        paused = true;  
    }
    
    function moveSnake(direction) {
        paused = false;
        var snakeLength;
        clearInterval(myInterval);
        currentDirection = direction;
        myInterval = setInterval(function(){
            drawSnakeHead(direction);
            
            snakeLength = snakeBodyArray.length;
            if(snakeLength >= snakeLengthLimit) {
                removeSnakeTail();
            }
        }, snakeSpeed);
        
        paused = false;
    }

    function drawSnakeHead(direction) {    
        switch(direction){
            case "left":
                currentXpos -= pixelsToMove;
                break;
            case "up":
                currentYpos -= pixelsToMove;
                break;
            case "right":
                currentXpos += pixelsToMove;
                break;
            case "down":
                currentYpos += pixelsToMove;
                break;
        }
        
        //Draws the head on the board
        $('#board').append('<div class="snakeHead" style="left: ' + currentXpos + 'px; top:' + currentYpos + 'px;"></div>');
        
        //Adds coordinates to the array
        addHeadToArray(currentXpos, currentYpos);
        
    }
    
    function removeSnakeTail() {
        //Remove from HTML (the visual snake)
        $('.snakeHead').first().remove();
        
        //Remove from the coordinates-array
        removeTailFromArray();
    }
    
    //Function to add a new head to the array
    function addHeadToArray(xPos, yPos) {
        //Create a new body part with coordinates
        var bodyPart = {
            xPos: xPos, 
            yPos: yPos
        };
        
        //Adds the body part object to the beginning of the array
        snakeBodyArray.unshift(bodyPart);
    }
    
    //Function to remove the last body part from the array
    function removeTailFromArray() {
        snakeBodyArray.pop();
    }

})();   

