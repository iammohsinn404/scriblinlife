import React from 'react';
import "./App.css"
import { Stage, Layer, Line, Text, Rect } from 'react-konva';
import * as Tone from 'tone';

const messages = ["you don't have time", "what are you doing here?", "you can't stay any longer", "the meaning of life is:", "you already know it", "be kind fr", "give all the credit to God", "you are nothing yet you are everything"]


const App = () => {
  const [lines, setLines] = React.useState([]);
  const [revealed, setRevealed] = React.useState(false);
  const [msgNumber, setMsgNumber] = React.useState(0);
  const isDrawing = React.useRef(false);
  const coatLayer = React.useRef(null);
  const moveCount = React.useRef(0);

  const noiseRef = React.useRef(null);
  const filterRef = React.useRef(null);;
  const synthRef = React.useRef(null);
  const soundStarted = React.useRef(null);
  const musicRef = React.useRef(null)
  


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
    if (percent > 0.10)  {
      setRevealed(true);
    };

  }

  React.useEffect(() => {
    const noise = new Tone.Noise('white');
    const filter = new Tone.Filter(400, 'highpass');
    noise.connect(filter);
    filter.toDestination();
    noise.volume.value = -Infinity; // 0%

    const synth = new Tone.Synth().toDestination();
    noiseRef.current = noise;
    filterRef.current = filter;
    synthRef.current = synth;

    return ()  => {
      noise.dispose();
      filter.dispose();
      synth.dispose();
    };

  }, []);


 
  
  const handleMouseDown = async (e) => {
    if (!soundStarted.current) {
      await Tone.start();
      await Tone.loaded();
      noiseRef.current.start();
      musicRef.current.play();
      musicRef.current.volume = 0.3;
      soundStarted.current = true;
    }

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
      const freq = 300 + Math.random() * 800;
      filterRef.current.frequency.rampTo(freq, 0.03);
      noiseRef.current.volume.rampTo(-25, 0.05);

  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    noiseRef.current.volume.rampTo(-Infinity, 0.1);
    checkShown();
  };

  const nextMessage = () => {
    setLines([]);
    setRevealed(false);
    setMsgNumber((i) => (i + 1) % messages.length);
  }


  return (
    <>
    <audio ref={musicRef} src="/Relent.mp3" loop/>   
    <Stage 
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
     <Layer>
      <Text text={messages[msgNumber]} x={0} y={300} width={width} align="center" fontSize={40} fontFamily="Beth Ellen"  fill="white"/>
     </Layer>
    
    <Layer className="containerScribble" ref={coatLayer}>
      <Rect x={0} y={0} width={width} height={height} fill="black" />
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
