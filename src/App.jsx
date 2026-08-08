import React from 'react';
import "./App.css"
import { Stage, Layer, Line, Text, Rect } from 'react-konva';

const messages = []


const App = () => {
  const [tool, setTool] = React.useState('pen');
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);
  const coatLayer = React.useRef(null);
  const moveCount = React.useRef(0);


  const width = window.innerWidth;
  const height = window.innerHeight;

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => [...prev,  [pos.x, pos.y]]);
  };

  const handleMouseMove = (e) => {
      if (!isDrawing.current) return;
      const pos = e.target.getStage().getPointerPosition();
      setLines((prev) => {
        const newLines = [...prev];
        newLines[newLines.length - 1] = newLines[newLines.length - 1].concat([pos.x, pos.y])
        return newLines;
      });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage 
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
     <Layer>
      <Text text="something" x={0} y={300} width={window.innerWidth} align="center" fontSize={40} fontFamily="Beth Ellen"  fill="white"/>
     </Layer>
    
    <Layer className="containerScribble">
      <Rect x={0} y={0} width={window.innerWidth} height={window.innerHeight} fill="black" />
         {lines.map((points, i) => (
          <Line
            key={i}
            points={points}
            stroke="white"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation="destination-out"
          />
        ))}
    </Layer>
    </Stage>
  );
};

export default App;
