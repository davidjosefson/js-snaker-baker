define(["./tile"], function(Tile){
    return function GameBoard(largeBoardSize, smallBoardStartX, smallBoardStartY, smallBoardEndX, smallBoardEndY) {    
        //PRIVATE VARIABLES
        var boardArray = [];
        var appleExist = false;
        
        //CREATE THE BOARD
        for(var x = 0; x < largeBoardSize; x++){
            //Creates an array at position y in the first array
            boardArray[x] = [];
            var tempTile;            

            //Y-coordinates
            for(var y = 0; y < largeBoardSize; y++) {
                //Creates a smallBoard-tile if the coordinates matches the small board parameters
                if((x >= smallBoardStartX) && (x <= smallBoardEndX) && (y >= smallBoardStartY) && (y <= smallBoardEndY)) 
                    tempTile = new Tile(x, y, "smallBoard");

                //..otherwise it should create a largeBoard-tile
                else 
                    tempTile = new Tile(x, y, "largeBoard");

                //Add the tile to the board array
                boardArray[x][y] = tempTile;
            }
        }        

        //PUBLIC METHODS
        //Check the flag of a certain tile
        this.checkTileFlag = function(xPos, yPos) {
            if(xPos < boardArray.length && yPos < boardArray[xPos].length) 
                return boardArray[xPos][yPos].flag;
            else 
                return false;
        };
        
        //Returns the size of the board
        this.boardSize = function(axis) {
            if(axis == "x") 
                return boardArray.length;
            else if(axis == "y") 
                return boardArray[0].length;
        };
        
        //Set a tile flag
        this.setTileBoardFlag = function(xPos, yPos, boardType) {
            if(boardType == "largeGameBoard" || boardType == "smallGameBoard") {
                boardArray[xPos][yPos].flag = boardType;
                return true;
            }
            else 
                return false;
        };
        
        //Adds an apple on a random "smallBoard" tile (empty tile)
        this.addRandomApple = function(appleType) {
            if(appleType == "apple" || appleType == "blueApple") {
                var randomXpos;
                var randomYpos;
                var emptyTileFound = false;

                while(!emptyTileFound){
                    randomXpos = getRandomInt(0, this.boardSize("x"));
                    randomYpos = getRandomInt(0, this.boardSize("y"));

                    if(boardArray[randomXpos][randomYpos].flag == "smallBoard")
                        emptyTileFound = true;
                }
                
                boardArray[randomXpos][randomYpos].flag = appleType;
                appleExist = true;
                return true;
            }
            else 
                return false;
        };
        
        //Check if apple exists on the board, if so, return true
        this.appleExist = function() {
            if(appleExist) 
                return true;
            else 
                return false;
        };
        
        //Loop through the game board and reset all flags of a certain type
        this.resetTiles = function(flagToReset, flagType) {
            for(var i = 0; i < boardArray.length; i++) {
                for(var j = 0; j < boardArray[i].length; j++){
                    if(boardArray[i][j].flag == flagToReset) {
                        boardArray[i][j].flag = flagType;
                    }
                }
            }
        };
        
        //Loop through the snake array and change the corresponding tiles on the gameboard
        this.syncBoardWithSnakeArray = function(snake) {
            for(var i = 0; i < snake.length; i++) 
                boardArray[snake[i].xPos][snake[i].yPos].flag = "snake";
        };
        
        //PRIVATE METHODS
        var getRandomInt = function(min, max){
            return Math.floor(Math.random() * (max - min) + min);
        };       
   };
});