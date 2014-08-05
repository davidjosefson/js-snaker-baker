//TODO: Make the snake tail disappear -> ANVÄND DET FAKTUM ATT DET ALLTID ÄR DEN "FÖRSTA" DIVEN I HTMLen SOM ÄR SIST PÅ SNAKEN. MAN KAN ENKELT TA BORT DEN FÖRSTA CHILD-DIVEN MAN HITTAR!
//TODO: Create some kind of Game over view
//TODO: Game over when hitting tail
//TODO: Game over when hitting wall
//TODO: [x]När man ändrar direction så ska den ta bort den nya intervallen och skapa en ny
//TODO: [x]Om man klickar på en knapp i "samma" riktning ska den ignorera detta (så att man inte kan speeda upp snaken)

/*jslint browser: true, devel: true, plusplus: true, todo: true, jQuery:false */
/*global $:false */
(function() {
    var currentDirection = "right";
    var currentXpos = 50;
    var currentYpos = 50;
    var myInterval;
    var pixelsToMove = 5;
    var snakeSpeed = 500;
    var paused = true;
    var snakeLengthLimit = 3;
    //var snakeBodyCounter = 0;
    //var removeTailHasRun = false;
    //var flipper = true;
    var snakeBodyArray = [];
    
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
                //SPACE
                case 32:
                    if(paused){
                        moveSnake(currentDirection);
                    }
                    else {
                        clearInterval(myInterval);
                        paused = true;
                    }
                    break;
            }
        });

    });

    function moveSnake(direction) {
        
        var snakeLength;
        
        clearInterval(myInterval);

        currentDirection = direction;

        myInterval = setInterval(function(){
            drawSnakeHead(direction);
            
            snakeLength = snakeBodyArray.length;
            if(snakeLength >= snakeLengthLimit)
                removeSnakeTail();
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
        //if(snakeLength == snakeLengthLimit)
        //    var classCounter = snakeBodyCounter;
        //else
        /*if(!removeTailHasRun)
            var classCounter = snakeBodyCounter + 1;
        else
            var classCounter = snakeBodyCounter;*/
        
        $('#board').append('<div class="snakeHead" style="left: ' + currentXpos + 'px; top:' + currentYpos + 'px;"></div>');
        
        addHeadToArray(currentXpos, currentYpos);
        
       /* snakeLength++;
        snakeBodyCounter++;
        if((snakeBodyCounter == snakeLengthLimit)) {
            snakeBodyCounter = 1;
        }*/
        
    }
    
    function removeSnakeTail() {
        //var classToRemove = ".body" + snakeBodyCounter;
        $('.snakeHead').first().remove();
        //snakeLength--;
        //removeTailHasRun = true;
        removeTailFromArray();
    }

    function addHeadToArray(xPos, yPos) {
        var bodyPart = {
            xPos: xPos, 
            yPos: yPos
        };
        
        snakeBodyArray.unshift(bodyPart);
    }
    
    function removeTailFromArray() {
        snakeBodyArray.pop();
    }
    
    
})();   

