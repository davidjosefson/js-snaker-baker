/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */

//TODO: [x]När man ändrar direction så ska den ta bort den nya intervallen och skapa en ny
//TODO: [x]Om man klickar på en knapp i "samma" riktning ska den ignorera detta (så att man inte kan speeda upp snaken)

var currentDirection = "right";
var startXpos = 50;
var startYpos = 50;
var currentXpos = 50;
var currentYpos = 50;
var myInterval;

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
        drawSnakeHead(currentXpos,currentYpos);
        
        switch(currentDirection){
            case "left":
                currentXpos -= 10;
                break;
            case "up":
                currentYpos -= 10;
                break;
            case "right":
                currentXpos += 10;
                break;
            case "down":
                currentYpos += 10;
                break;
        }

    }, 200);
    
}

function drawSnakeHead(xPos, yPos) {
    $('#board').append('<div class="snakeHead" style="left: ' + xPos + 'px; top:' + yPos + 'px;"></div>');
    //$('#board .snakeHead').css('top', yPos).css('left', xPos);
}

