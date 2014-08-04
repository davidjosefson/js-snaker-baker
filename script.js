/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */

//TODO: [x]När man ändrar direction så ska den ta bort den nya intervallen och skapa en ny
//TODO: [x]Om man klickar på en knapp i "samma" riktning ska den ignorera detta (så att man inte kan speeda upp snaken)
//TODO: 

var currentDirection = "right";
var currentXpos = 50;
var currentYpos = 50;
var myInterval;
var pixelsToMove = 5;
var snakeSpeed = 50;

$(document).ready(function(){
    
    moveSnake("right");
    
    $(document).keydown(function(key){
        //$('#board').html('This key is pressed: ' + key.which);    

        switch(key.which) {
            //LEFT
            case 37: 
                if((currentDirection != "right") && (currentDirection != "left"))
                    moveSnake("left");
                break;
            
            //UP
            case 38:
                if((currentDirection != "down") && (currentDirection != "up"))
                    moveSnake("up");
                break;                
            
            //RIGHT
            case 39: 
                if((currentDirection != "right") && (currentDirection != "left"))
                    moveSnake("right");
                break;
            //DOWN
            case 40:
                if((currentDirection != "down") && (currentDirection != "up"))
                    moveSnake("down");
                break;
        
        }
    });
    
});

function moveSnake(direction) {
    clearInterval(myInterval);
    
    currentDirection = direction;
    
    myInterval = setInterval(function(){
        drawSnakeHead(direction);

    }, 50);
    
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
    
    $('#board').append('<div class="snakeHead" style="left: ' + currentXpos + 'px; top:' + currentYpos + 'px;"></div>');
    //$('#board .snakeHead').css('top', yPos).css('left', xPos);
}

