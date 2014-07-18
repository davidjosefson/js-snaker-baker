/*jslint browser: true, devel: true, plusplus: true, todo: true*/
/* global $:false, jQuery:false */

var currentDirection = "right";
var snakeSpeed = 50;
var intervalSpeed = 150;
var myInterval;
var currentInterval;

$(document).ready(function(){
    
    currentInterval = setInterval(function(){
        $('#snake').animate({left: '+=5px'}, snakeSpeed, 'linear');
    }, intervalSpeed);
    
    //autoMoveSnake();
    
    $(document).keydown(function(key){
        $('snake').clearQueue();
        switch(key.which) {
            case 37: 
                moveSnake("left");
                break;
            case 38:
                moveSnake("up");
                break;                
            case 39: 
                moveSnake("right");
                break;
            case 40:
                moveSnake("down");
                break;
        }    
        
        /*switch(key.which) {
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
        }*/
    });    
    
});

//KANSKE BEHÖVER ÄNDRA INTERVALET SÅ ATT DET ALLTID SÄTTS PÅ NYTT NÄR MAN KLICKAR DVS 4 OLIKA INTERVAL!

function autoMoveSnake() {
    myInterval = setInterval(function(){
        switch(currentDirection) {
            case "left":
                $('#snake').animate({left: '-=5px'}, snakeSpeed, 'linear');
                break;
            case "up":
                $('#snake').animate({top: '-=5px'}, snakeSpeed, 'linear');
                break;
            case "right":
                $('#snake').animate({left: '+=5px'}, snakeSpeed, 'linear');
                break;
            case "down":
                $('#snake').animate({top: '+=5px'}, snakeSpeed, 'linear');
                break;
        }
    }, 400);
}

function changeDirectionForInterval(direction) {
    clearInterval(currentInterval);
}

function moveSnake(direction){
    clearInterval(currentInterval);
    $('snake').stop().clearQueue();
    switch(direction) {
        case "left":
            currentInterval = setInterval(function(){
                $('#snake').animate({left: '-=5px'}, snakeSpeed, 'linear');
            }, intervalSpeed);
            //currentDirection = "left";
            break;
        case "up":
            currentInterval = setInterval(function(){
                $('#snake').animate({top: '-=5px'}, snakeSpeed, 'linear');
            }, intervalSpeed);
                //currentDirection = "up";
            break;
        case "right":
            currentInterval = setInterval(function(){
                $('#snake').animate({left: '+=5px'}, snakeSpeed, 'linear');
            }, intervalSpeed);
                //currentDirection = "right";
            break;
        case "down":
            currentInterval = setInterval(function(){
                $('#snake').animate({top: '+=5px'}, snakeSpeed, 'linear');
            }, intervalSpeed);
            break;
    } 
}