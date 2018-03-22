import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// A Square Object/Component
// a "controlled component" ----> no longer keeps its own state
//                          ----> receives value from its parent Board
//                          ----> and informs parent when clicked
// class Square extends React.Component { 
//   // When rendered, this stuff happens
//   render() {
//     return (
//       // A button is displayed with the className "square",
//       // onClick which is determined by the props.onClick,
//       // and displayed text based on props.value
//       <button className="square" 
//               onClick={()=> this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// The whole Square component above has been replaced with the
// "Functional Component" below
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
    // Note: For this, onClick={props.onClick()} would not work,
    // because it would call props.onClick immediately instead
    // of passing it down
  );
}

// A Board Object/Component
class Board extends React.Component {
  // Constructor. Commented out since we will no longer use it
  // Props will be passed from Game Component
  // constructor(props) {
  //   super(props);
  //   // Control state from the Board rather than the Square
  //   this.state = {
  //     // Initialize an Array of 9 to keep track of squares' states
  //     squares: Array(9).fill(null),
  //     //symbol: 'X',
  //     xIsNext: true,
  //   };
  // }
  
  // Handler Method --- Moved to Game Class
  // handleClick(i) {
  //   // .slice() copies the squares array instead of mutating
  //   // the existing one
  //   const squares = this.state.squares.slice();

  //   // Ignore click if someone has already won
  //   if(calculateWinner(squares) || squares[i]){
  //     return;
  //   }

  //   //squares[i] = this.state.symbol;
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext, //flip it!
  //   });

  //   //this.changeSymbol();    
  // }

  // I added this before continuing the tutorial :')
  // changeSymbol() {
  //   if (this.state.symbol == 'X')
  //     this.state.symbol = 'O';
  //   else
  //     this.state.symbol = 'X';
  // }

  // Method used for rendering the whole board
  // Information to render one specific square in the board
  renderSquare(i) {
    return (
      // Sets the props for Square I believe(?)
      <Square 
        value={this.props.squares[i]} 
        // Note: it is conventional to use "on*" names for the attributes
        // and "handle*" for the handler methods
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // Render method for the whole board
  render() {
    // const status = 'Next player: ' + 
    //                (this.state.xIsNext ? 'X' : 'O');

    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // }
    // else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // .slice() copies the squares array instead of mutating
    // the existing one
    //const history = this.state.history;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // Ignore click if someone has already won
    if(calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, //flip it!
    }); 
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] &&
      squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
