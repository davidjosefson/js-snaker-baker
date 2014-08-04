/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */

var currentDirection = "right";
var startXpos = 50;
var startYpos = 50;
var currentXpos = 50;
var currentYpos = 50;

$(document).ready(function(){
    
    moveSnake();
    
    $(document).keydown(function(key){
        //$('#board').html('This key is pressed: ' + key.which);    

        switch(key.which) {
            //LEFT
            case 37: 
                currentDirection = "left";
                break;
            
            //UP
            case 38:
                currentDirection = "up";
                break;                
            
            //RIGHT
            case 39: 
                currentDirection = "right";
                break;
            //DOWN
            case 40:
                //$('#snake').animate({top: '+=10px'}, 50);
                currentDirection = "down";
                break;
        
        }
    });
    
});

function moveSnake() {
    var myInterval = setInterval(function(){
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

    }, 500);
    
}

function drawSnakeHead(xPos, yPos) {
    $('#board').append('<div class="snakeHead" style="left: ' + xPos + 'px; top:' + yPos + 'px;"></div>');
    //$('#board .snakeHead').css('top', yPos).css('left', xPos);
}

