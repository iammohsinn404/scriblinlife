import React from 'react';
import "./App.css"
import { Stage, Layer, Line, Text, Rect } from 'react-konva';

const messages = ["you don't have time", "what are you doing here?", "you can't stay any longer", "the meaning of life is:", "you already know it"]


const App = () => {
  const [tool, setTool] = React.useState('pen');
  const [lines, setLines] = React.useState([]);
  const [revealed, setRevealed] = React.useState(false);
  const [msgNumber, setMsgNumber] = React.useState(0);
  const isDrawing = React.useRef(false);
  const coatLayer = React.useRef(null);
  const moveCount = React.useRef(0);

  


  const width = 1500;
  const height = 600;

  const checkShown = () => {
    const layer = coatLayer.current;
    if (!layer) return;
    const ctx = layer.getContext();
    const { data } = ctx.getImageData(0, 0, width, height);
    let transparentCount = 0;
    let totalSampled = 0;
    for (let i = 3; i < data.length; i += 4 * 20) {
      totalSampled++
      if (data[i] == 0) transparentCount++;
    }
    const percent = transparentCount / totalSampled;
    console.log(percent)
    if (percent > 0.10) setRevealed(true);
  }

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
    checkShown();
  };

  const nextMessage = () => {
    setLines([]);
    setRevealed(false);
    setMsgNumber((i) => (i + 1) % messages.length);
  }

  return (
    <>
    <Stage 
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
     <Layer>
      <Text text={messages[msgNumber]} x={0} y={300} width={width} align="center" fontSize={40} fontFamily="Beth Ellen"  fill="black"/>
     </Layer>
    
    <Layer className="containerScribble" ref={coatLayer}>
      <Rect x={0} y={0} width={width} height={height} fill="gray" />
         {lines.map((points, i) => (
          <Line
            key={i}
            points={points}
            stroke="white"
            strokeWidth={10}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation="destination-out"
          />
        ))}
    </Layer>
    </Stage>

   {revealed && <button onClick={nextMessage}>→</button>}
</>
  );
};

export default App;
