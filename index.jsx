if( window.location.host==="tetris.jamescarlharris.com"){

}
var GameBox = React.createClass({
    getInitialState: function(){
        //var level = parseInt(prompt("Starting Level?",1));
        //this.props.gameState.level = -level;
        var issues = "Not sure..";
        issues = loadIssuesNumber(issues);
        return {
                gameState: this.props.gameState,
                paused: true,
                issues: issues,
                keyMappings: this.props.keyMappings,
                keyMapping: this.props.keyMappings["default"],
                currentMap: "default",
                closeGameoverScreen: true
                };
    },
     componentDidMount: function(){
        // componentDidMount is called by react when the component
        // has been rendered on the page. We can set the interval here:
        window.addEventListener('keydown', this.handleKeys);
        this.autoGravity = setInterval(this.gravity, 500+this.state.gameState.level);
    },

    componentWillUnmount: function(){
        // This method is called immediately before the component is removed
        // from the page and destroyed. We can clear the interval here:
        clearInterVal(this.autoGravity);
    },
    gravity: function(){
        if(this.state.paused) {
            return;
        }
        else if(!this.state.gameState.gameOver){
            if(this.state.gameState.fallingPiece){
                if(!this.state.gameState.moveFallingDown()){
                    this.state.gameState.dropFallingPiece();
                }else{
                }
            }
        }else{
            this.state.closeGameoverScreen = false;
            this.pause();
        }
        this.setState({gameState:this.state.gameState,closeGameoverScreen:this.state.closeGameoverScreen});
    },pickAlevel:function(){
        var level = parseInt(prompt("Starting Level?"));
        this.state.gameState.restart();
        this.state.gameState.level = -level;
        this.setState({gameState:this.state.gameState,paused:true});
    },
    restart: function(){
        if(confirm("Are You Sure You Want to Restart?")){
        this.state.gameState.restart();
        this.setState({gameState:this.state.gameState,paused:true,closeGameoverScreen:true});
        }
    },changeMapping:function(){
        if(this.state.currentMap === "default"){
                this.state.currentMap = "arrows";
            }else{
                this.state.currentMap = "default";
            }
        this.state.keyMapping = this.state.keyMappings[this.state.currentMap];
    },
    pause: function(){
        this.state.paused = !this.state.paused;
        this.setState({paused:this.state.paused});
    },
    handleKeys:function(evt){
        var currEvent = evt;
        var key = evt.keyCode;
        //console.log(key);
        if(evt instanceof KeyboardEvent ){
            if(!this.state.paused && this.state.gameState.fallingPiece && this.state.keyMapping.keys[key] !== undefined){
                if(this.state.gameState[this.state.keyMapping.keys[key].function] !== undefined){
                    this.state.gameState[this.state.keyMapping.keys[key].function]();
                }else{
                    this[this.state.keyMapping.keys[key].function]();
                }
            }else if(evt instanceof KeyboardEvent){
                if(key === 32||key === 13||key === 192){
                    this[this.state.keyMapping.keys[key].function]();
                }
            }
        }
        this.setState({gameState:this.state.gameState,keyMapping:this.state.keyMapping,currentMap:this.state.currentMap});
    },toggleGhost:function(){
        console.log("Ghost");
        this.state.gameState.settings.useGhost = !this.state.gameState.settings.useGhost;
        this.setState({gameState:this.state.gameState});
    },togglePreview:function(){
        this.state.gameState.settings.canPreview = !this.state.gameState.settings.canPreview;
        this.setState({gameState:this.state.gameState});
    },toggleHold:function(){
        this.state.gameState.settings.canHold = !this.state.gameState.settings.canHold;
        this.setState({gameState:this.state.gameState});
    },closeGameoverScreen: function(){
        this.state.closeGameoverScreen = true;
        this.setState({closeGameoverScreen:this.state.closeGameoverScreen});
    },
    render: function() {
        var tempBoard = this.state.gameState.getCurrentBoard();
/*
        tempBoard.shift();
        tempBoard.shift();
*/
        var currentIssues = this.state.issues;
        currentIssues = currentIssues.map(function(issue){
            return <p>{issue.title}</ p>;
            });

        var boardCells = <div className="cells">
            {tempBoard.map(function(row) {
                return <div className="row">{row.map(function(cell) {
                    return <div className={"cell "+cell.getType()} style={{"backgroundColor": cell.color}}></div>;
            })}</div>;
            })}
            Current Lines cleared {this.state.gameState.level*-1}
            </div>;
        return (
            <div className="GameBox">
                {boardCells}
                    <div className="Controls">
                        <div className="keyMappings">
                        {this.state.keyMapping.keys.readableLines().map(function(line){
                            return <p className="leftAlign">{line}</p>
                        })}
                        </ div>
                        <div>
                        <p className={"pauseLabel "+(this.state.paused ?"paused":"notPaused")}>{this.state.paused ?"Play":"Pause"}</p>
                        </div>
                        <div className="Settings">
                            <input onClick={this.toggleGhost} className={this.state.gameState.settings.useGhost ? "off":"on"} type="button" value="Ghost"/>
                            <input onClick={this.togglePreview} className={this.state.gameState.settings.canPreview ? "off":"on"} type="button" value="Preview"/>
                            <input onClick={this.toggleHold} className={this.state.gameState.settings.canHold ? "off":"on"} type="button" value="Hold"/>
                        </ div>
                    </div>
                    <div className ="Issues">
                    <hr />
                    Any New issues? <a href="https://github.com/hibooboo2/react_Tetris/issues" target="_blank">Add Them</a>
                    <hr />
                    All Issues: {this.state.issues.length}
                    {currentIssues}
                    </ div>
                    <div className={this.state.closeGameoverScreen? "disabled" : "gameOver"}>
                        <p>Congratulations! </p>
                        <p>You made it to level:</p>
                        <p>{this.state.gameState.level}</p>
                        <p>Good Job!</p>
                        <input onClick={this.closeGameoverScreen} className="button" type="button" value="Close"/>
                    </div>
                <div className={"previewBox "+(this.state.gameState.settings.canPreview ? "enabled":"disabled")}>
                    <TetrisPreview que={Piece.prototype.que} />
                    <TetrisPiece thePiece={this.state.gameState.getFallingPiece()}/>
                </ div>
            </div>
        )
    }
});

var TetrisCell = React.createClass({
    getInitialState: function(){
            return {
                    theCell:this.props.theCell
                    };
        },
  render: function() {
    return(
        <div className={"TetrisCell "+this.state.theCell.getType()} style={{"backgroundColor": this.state.theCell.type !==5 ? this.state.theCell.color:"lightgrey"}}>
        </div>
    );
  }
});

var TetrisPreview = React.createClass({
    render: function() {
        var thePieces = Piece.prototype.que.map(function(piece){
                    return (
                        <TetrisPiece thePiece={piece}/>
                    );
        });
        return (
                <div className="TetrisPreview">
                    {thePieces}
                </div>
                );
            }
});

var TetrisPiece = React.createClass({
    getInitialState: function(){
        return {
                pieceState:this.props.thePiece};
    },
    render: function() {
        var cells = this.state.pieceState.cells2d();
        //console.log(cells);
        var theCells = cells.map(function(row){
                return <div className="row"> {row.map(function(aCell){
                    return (
                        <TetrisCell theCell={aCell}/>
                    );
                    })}
                    </ div>
                });
        return (
                <div className="TetrisPiece">
                    {theCells}
                </div>
                );
            }
});

var TetrisGame = React.createClass({
  render: function() {
    return (
      <div className="TetrisGame">
        <GameBox gameState={this.props.gameState} keyMappings={this.props.keyMappings}/>
      </div>
    );
  }
});

var theKeys = keyMappings();

React.render(
  <TetrisGame gameState={new boardEngine()} keyMappings={theKeys}/>,
/*  <TetrisPiece thePiece={new Piece().draw()}/>,*/
  document.getElementById('main_Container')
);
