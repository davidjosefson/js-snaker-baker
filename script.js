/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */

var currentDirection = "right";

$(document).ready(function(){
    
    moveSnake();
    
    $(document).keydown(function(key){
        //$('#board').html('This key is pressed: ' + key.which);    

        switch(key.which) {
            //LEFT
            case 37: 
                $('#snake').animate({left: '-=10px'}, 50);
                break;
            
            //UP
            case 38:
                $('#snake').animate({top: '-=10px'}, 50);
                break;                
            
            //RIGHT
            case 39: 
                $('#snake').animate({left: '+=10px'}, 50);
                break;
            //DOWN
            case 40:
                $('#snake').animate({top: '+=10px'}, 50);
                break;
        
        }
    });    
    
});

function moveSnake() {
    var myInterval = setInterval(function(){
        $('#snake').animate({left: '+=10px'}, 50);
    }, 500);
}

