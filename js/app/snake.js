define(["./snakehead"], function(SnakeHead){
    return function Snake(startXpos, startYpos){
        var snakeBody = [];
        
        //Create the snake
        snakeBody.push(new SnakeHead(startXpos, startYpos));
        
        //PUBLIC METHODS
        this.addHead = function(direction){
            var head = createNewHeadBasedOnDirection(direction);
            addHeadToBody(head);
        };
        
        this.removeTail = function(){
            snakeBody.pop();
        };
        
        this.getCurrentHead = function(){
            return snakeBody[0];
        };
        
        this.getSnakeBodyArray = function(){
            return snakeBody;  
        };
        
        this.getLength = function(){
            return snakeBody.length;  
        };
        
        //PRIVATE METHODS
        var createNewHeadBasedOnDirection = function(direction){
            var newHeadXpos, newHeadYpos;

            switch(direction){
                case "left":
                    newHeadXpos = getCurrentHeadXpos() - 1;
                    newHeadYpos = getCurrentHeadYpos();
                    break;
                case "up":
                    newHeadXpos = getCurrentHeadXpos();
                    newHeadYpos = getCurrentHeadYpos() + 1;
                    break;
                case "right":
                    newHeadXpos = getCurrentHeadXpos() + 1;
                    newHeadYpos = getCurrentHeadYpos();
                    break;
                case "down":
                    newHeadXpos = getCurrentHeadXpos();
                    newHeadYpos = getCurrentHeadYpos() - 1;
                    break;
            }
            
            return new SnakeHead(newHeadXpos, newHeadYpos);
        };
        
        var addHeadToBody = function(head){
            snakeBody.unshift(head);   //Add head to beginning of array
        };
        
        var getCurrentHeadXpos = function(){
            return snakeBody[0].xPos;
        };
        
        var getCurrentHeadYpos = function(){
            return snakeBody[0].yPos;
        };
        
    };
});