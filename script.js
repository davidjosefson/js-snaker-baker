/*jslint browser: true, devel: true, plusplus: true, todo: true*/
/* global $:false, jQuery:false */

var currentDirection = "right";

$(document).ready(function(){
    
    moveSnake();
    
    $(document).keydown(function(key){
        //$('#board').html('This key is pressed: ' + key.which);    

        switch(key.which) {
            case 37: 
                currentDirection = "left";
                break;
            case 38:
                currentDirection = "up";
                break;                
            case 39: 
                currentDirection = "right";
                break;
            case 40:
                currentDirection = "down";
                break;
        }
    });    
    
});

function moveSnake() {
    var myInterval = setInterval(function(){
        switch(currentDirection) {
            case "left":
                $('#snake').animate({left: '-=10px'}, 50);
                break;
            case "up":
                $('#snake').animate({top: '-=10px'}, 50);
                break;
            case "right":
                $('#snake').animate({left: '+=10px'}, 50);
                break;
            case "down":
                $('#snake').animate({top: '+=10px'}, 50);
                break;
        }
        
        //$('#snake').animate({left: '+=10px'}, 50);
    }, 500);
}

