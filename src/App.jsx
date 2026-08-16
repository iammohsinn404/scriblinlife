import React from "react";
import "./App.css";
import { Stage, Layer, Line, Text, Rect, Circle } from "react-konva";
import Konva from "konva";
import * as Tone from "tone";

const ogScriblinLifeMessages = [
  "you don't have time",
  "what are you doing here?",
  "you can't stay any longer",
  "the meaning of life is:",
  "you already know it",
  "be kind fr",
  "give all the credit to God",
  "you are nothing yet you are everything",
];


const emotionalMesaages = [
  "Wanna listen My 'Dard'",
  "Soo, nothing is to cry",
  "But, sad like i remember those days",
  "the little child (ME)",
  "if he falls down",
  "others comes to pick",
  "But, now the people wanna see That little",
  "to fall!",
  "i donno what is written in my 'fate'",
  "But, i always pray",
  "that everyone could have the Best Fate",
  "Thank You... _iammohsinn404_",
]

const messageSets = {
  "ogScriblinLifeMessages by somebodyouknow": ogScriblinLifeMessages,
  "emotionalMesaages by _iammohsinn404_": emotionalMesaages
}

const App = () => {
  const [started, setStarted] = React.useState(false);
  const [lines, setLines] = React.useState([]);
  const [revealed, setRevealed] = React.useState(false);
  const [msgNumber, setMsgNumber] = React.useState(0);
  const [selectedMessages, setSelectedMessages] = React.useState(ogScriblinLifeMessages);
  const [selectedSetName, setSelectedSetName] = React.useState(ogScriblinLifeMessages);

  const isDrawing = React.useRef(false);
  const coatLayer = React.useRef(null);
  const drawTimeoutRef = React.useRef(null);
 

  const noiseRef = React.useRef(null);
  const filterRef = React.useRef(null);
  const synthRef = React.useRef(null);
  const soundStarted = React.useRef(null);
  const musicRef = React.useRef(null);


  const moonRef = React.useRef(null);

  const FIREFLIES_NUM = 20;
  const fireflyRef = React.useRef(null);
  const fireflyNodes = React.useRef([]);


  const width = 1520;
  const height = 600;

  const checkShown = () => {
    const layer = coatLayer.current;
    if (!layer) return;
    const ctx = layer.getContext();
    const { data } = ctx.getImageData(0, 0, width, height);
    let transparentCount = 0;
    let totalSampled = 0;
    for (let i = 3; i < data.length; i += 4 * 20) {
      totalSampled++;
      if (data[i] == 0) transparentCount++;
    }
    const percent = transparentCount / totalSampled;
    console.log(percent);
    if (percent > 0.1) {
      setRevealed(true);
    }
  };

  // scribbling sound
  React.useEffect(() => {
    const noise = new Tone.Noise("white");
    const filter = new Tone.Filter(3500, "highpass");
    noise.connect(filter);
    filter.toDestination();
    noise.volume.value = -Infinity; // 0%

    const synth = new Tone.Synth().toDestination();
    noiseRef.current = noise;
    filterRef.current = filter;
    synthRef.current = synth;

    return () => {
      noise.dispose();
      filter.dispose();
      synth.dispose();
    };
  }, []);

  // moon animation
  React.useEffect(() => {
    const animation = new Konva.Animation((frame) => {
      if (!moonRef.current) return;

      //glow, forgive me but i am bad at math so i used ai here
      const glow = 15 + Math.sin(frame.time / 500) * 10;
      moonRef.current.shadowBlur(glow);
      moonRef.current.opacity(0.7 + Math.sin(frame.time / 700) * 0.3);
    }, moonRef.current?.getLayer());
    animation.start();
    return () => animation.stop();
  }, []);

  // fireflies animation
  React.useEffect(() => {
    const animation = new Konva.Animation((frame) => {
      fireflyNodes.current.forEach((node, i) => {
        if (!node) return;
        const t = frame.time / 2000 + i * 5; // offset each firefly so they don't move in sync
        const x =
          width / 2 +
          Math.sin(t * 0.3) * (width / 2.5) +
          Math.sin(t * 1.7) * 40;
        const y =
          height / 2 +
          Math.cos(t * 0.4) * (height / 2.5) +
          Math.cos(t * 2.1) * 30;
        node.x(x);
        node.y(y);
        node.opacity(0.4 + Math.abs(Math.sin(t * 2)) * 0.6);
      });
    }, fireflyRef.current);
    animation.start();
    return () => animation.stop();
  }, []);

  const handleMouseDown = async (e) => {
    if (!soundStarted.current) {
      await Tone.start();
      await Tone.loaded();
      noiseRef.current.start();
      musicRef.current.play();
      musicRef.current.volume = 0.5;
      soundStarted.current = true;

    }

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => [...prev, [pos.x, pos.y]]);


    clearTimeout(drawTimeoutRef.current);
    drawTimeoutRef.current = setTimeout(() => {
      isDrawing.current = false;
      noiseRef.current.volume.rampTo(-Infinity, 0.5);
      checkShown();
    }, 3000)
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => {
      const newLines = [...prev];
      newLines[newLines.length - 1] = newLines[newLines.length - 1].concat([
        pos.x,
        pos.y,
      ]);
      return newLines;
    });
    const freq = 300 + Math.random() * 800;
    filterRef.current.frequency.rampTo(freq, 0.03);
    noiseRef.current.volume.rampTo(-30, 0.3);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    clearTimeout(drawTimeoutRef.current);
    noiseRef.current.volume.rampTo(-Infinity, 0.1);
    checkShown();
  };

  const nextMessage = () => {
    setLines([]);
    setRevealed(false);
    setMsgNumber((i) => (i + 1) % selectedMessages.length);
  };

  if (!started){
    return(
      <div className="splash-screen" >
        <h1>scriblinlife</h1>
        <p>scribble, keep scribblin.</p>
        <button className="start" onClick={() => setStarted(true)}>start game</button>
        <div className="instructions"></div>
      </div>
    )
  }
  return (
    <>
      <audio ref={musicRef} src="/Relent.mp3" loop />

      <select 
        value={selectedMessages} 
        onChange = {(e) => {
          setSelectedSetName(e.target.value);
          setSelectedMessages(messageSets[e.target.value]);
          setMsgNumber(0);
          setLines([]);
          setRevealed(false);
        }}
        >
          {Object.keys(messageSets).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        
        </select>

      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Text
            text={selectedMessages[msgNumber]}
            x={0}
            y={300}
            width={width}
            align="center"
            fontSize={60}
            fontFamily="Mansalva"
            fill="white"
            top="-50px"
          />
        </Layer>

        <Layer className="containerScribble" ref={coatLayer}>
          <Rect x={0} y={0} width={width} height={height} fill="black" />
          {lines.map((points, i) => (
            <Line
              key={i}
              points={points}
              stroke="white"
              strokeWidth={15}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation="destination-out"
            />
          ))}
        </Layer>

        <Layer>
          <Circle
            ref={moonRef}
            x={100}
            y={50}
            radius={30}
            fillRadialGradientStartPoint={{ x: -15, y: -15 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndRadius={50}
            fillRadialGradientColorStops={[
              0,
              "#fbfaf7",
              0.5,
              "#c1bcaed8",
              1,
              "#ffffff",
            ]}
            shadowColor="#f5f3e7"
            shadowBlur={20}
            shadowOpacity={1}
          />
        </Layer>

        <Layer>
          {Array.from({length: FIREFLIES_NUM}).map((_, i) => (
            <Circle 
              key={i}
              ref={(node) => (fireflyNodes.current[i] = node)}
              radius={2}
              fill="#fddba4"
              shadowColor="#fddba3"
              shadowBlur={8}
              shadowOpacity={1}
              />
          ))}
        </Layer>
      </Stage>

      {revealed && <button className="next" onClick={nextMessage}>→</button>}
    </>
  );
};

export default App;
