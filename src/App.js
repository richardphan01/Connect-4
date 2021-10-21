import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'

export default class App extends React.Component {

  // Sets state for various basic game aspects such as rows and columns of the grid board, array for playermoves, and which player turn it is
  state = {
    rows: 6,
    columns: 7,
    moves: [],
    playerTurn:'red',
  };

  // Reset board function to restart the game after end
  resetBoard = () => {
    this.setState({moves: [], winner: null });
  }

  // Getting the move associated with row and column or returns undefined if no pieces have been placed
  getPiece = (x,y) => {
    const list = this.state.moves.filter((item) => {
      return(item.x === x && item.y === y);

    });
    return list[0];
  }

  // Checks the location of the piece based on x and y position
  // Added a x,y velocity variable which accounts for changes in diagonal in each of the 4 grid sections (+x,+y), (+x,-y), (-x,+y), (-x,-y)
  getWinningMovesForVelocity = (xPos, yPos, xVelocity, yVelocity) => {
    const winningMoves = [{x : xPos, y: xPos}];
    const player = this.getPiece(xPos,yPos).player;

    // Checks the positive X and Y axis (horizontally to the right and vertically up)
    for (let delta = 1; delta <= 3; delta++){
      const checkX = xPos+xVelocity*delta;
      const checkY = yPos+yVelocity*delta;
      
      const checkPiece = this.getPiece(checkX,checkY);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y:checkY});
      } else {
        break;
      }
    }

    // Checks the negative X and Y axis (horizontally to the left and vertically down)
    for (let delta = -1; delta >= -3; delta--){
      const checkX = xPos+xVelocity*delta;
      const checkY = yPos+yVelocity*delta;
      
      const checkPiece = this.getPiece(checkX,checkY);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y:checkY});
      } else {
        break;
      }
    }

    return winningMoves;
  }

  // Checks if the player has won and accounts for both vertically, horizontally, and diagonally
  checkForWin = (x,y,player) => {
    
    // Four directions needed to check
    const velocities = [{x: 1, y:0}, {x:0,y:1}, {x:-1,y:1}, {x:1,y:1}]
    for (let dex =0; dex<velocities.length; dex++) {
      const element = velocities[dex];
      const winningMoves = this.getWinningMovesForVelocity(x,y,element.x,element.y);
      if (winningMoves.length > 3) {
        this.setState({winner: this.getPiece(x,y).player,winningMoves});
      }
    }
  }
  

  // Adds the second player move to the game allowing for alternating turns and piece colour
  addMove = (x,y)=> {
    const { playerTurn } = this.state;
    const nextPlayerTurn = playerTurn==='red' ? 'yellow' : 'red';
    let availableYPosition = null;
    // Adds functionality and game logic by having the piece fall to the bottom-most row of the column that is pressed
    for (let position = this.state.rows - 1; position >= 0; position--){
      if (!this.getPiece(x,position)){
        availableYPosition = position;
        break;
      }
    }
    // Check for a win based on next move only if there is a piece in the adjacent spot
    if (availableYPosition != null) {
      this.setState({ moves: this.state.moves.concat({x,y: availableYPosition,player: playerTurn}), playerTurn: nextPlayerTurn }, ()=> this.checkForWin(x,availableYPosition,playerTurn));
    }

    
  }
  

  // Creating and styling the grid/board of Connect-4 to look similar to the game
  // Creating rows and columns of board
  // Line 41: Checks if there is a piece there, changes colour of location to colour of the piece the player is using, otherwise, is undefined and colour remains the same (empty)
  renderBoard() {
    const { rows, columns, winner } = this.state;
    const rowViews = [];

    for (let row = 0; row < this.state.rows; row++){
      const columnViews = []; 
      for (let column = 0; column < this.state.columns; column++){
        const piece = this.getPiece(column, row);
        columnViews.push(
          <div onClick={() => {this.addMove(column,row)}} style={{ height: '6vw', width: '6vw', backgroundColor: '#00a8ff', display: 'flex', padding: 5, cursor: 'pointer', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.25)'}}>
            <div className="slot">
              {piece ? <div className='piece' style={{backgroundColor: piece.player}} /> : undefined}
            </div>
          </div>
        );
      }
      rowViews.push(
        <div className="row">{columnViews}</div>
      );
    }
    // Returns the complete grid/board
    return (
      <div className='boardStyle'>
        {winner && <div className="resetBoard" onClick={this.resetBoard}>{`${winner} WINS!`}</div>}
        {rowViews}
      </div>
    );
  }

  // Renders the complete board and grid with specified styles to be viewed on the webpage
  render() {
    const { style } = this.props;
    const { playerTurn } = this.state;
    return (
      <div style = {style ? Object.assign({}, styles.container, style) : styles.container}>
        <div className ="currentTurn">
          Current Player: <span style ={{color: playerTurn}}>●</span>
          {this.renderBoard()}
          <button className="clear" onClick={this.resetBoard}>Clear Board</button>
        </div> 
      </div>
    );
  }
}

// Styling the complete grid/board in reference to the webpage
const styles = {
  container: {
    height: '100%',
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
  }
};
