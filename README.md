# Scriblinlife

## Story

While trying to figure out, what my next project should be. I thought of a scribbling game, in which you scribble the meaning of life.
I got the entire setup in my mind:

- A canvas
- A text layer
- A coat layer
- An eraser tool
- Tone.js scribling sound

This was all enough for making the project work. I set up the coat layer over the text, and this wasn't as simple as it seems. 
When the coat and text layer started working, I thought of if I change the coat layer from gray to black. Then I changed the body background to black, so it just looks like the text is coming out and the coat layer is on the entire screen. 

During development, I faced issues with placing html elements on the canva. I used the react-konva library. I resized the canvas many times bcz I couldn't get everything all right. I had added an arrow that would only show when you have scribbled some part of the canvas, and then you could move forward to the next message. I had set the canvas width and height to the windows width and height. This was making the scrollbar appear and that was extremely painful. I added the property for overflow: hidden; 

It didn't do much bcz...It was now hiding the stupid arrow. After that I had to resize the canvas multiple times until I got it look good enough. 

Then I got the scribbling sound part, and it was preety easy to set up thanks to Tone.js. I got the scribbling sound to work, but it doesn't sound too good till now, I have to work more on some parts of the game. Actually, I have to set up the lfo for the sound to actually make it sound really good. The lfo will actually not do much except control the way the sound works, like making it actually sound like a scribbling sound.

I then tried to use Tone.js to get the background music which I found from a website ____. Forgot the name, but will surely list it here. The music single handedly pissed me off really badly bcz now my stupid IDM integration extension was keep downloading the music creating bugs I couldn't really control. I switched the simple audio tag and also "the music only starts on the user gesture". So the main functionality was set up now. 

I then added fireflies and a moon, this was simple but took alot of adjusting throughout the entire development journey.

--- 
## Technologies

- React.js
- Javascript
- Tone.js
- React-konva
- CSS

---
## Adding your own messages 

I added a dropdown functionality, which was made for the purpose that people could add their own scribls in my game.

So if you clone my repo, and create a new array near the other arrays, with all the messages you have. Please try to keep it above 4 messages.

``` js
const exampleMessages = [
  "random message 1", 
  "random message 2",
  "random message 3"
]

```

Add your array to the messageSets array.
``` js
const messageSets = {
  "ogScriblinLifeMessages by somebodyouknow": ogScriblinLifeMessages,
  "emotionalMesaages by _iammohsinn404_": emotionalMesaages,
  "exampleMessages by you": exampleMessages, // add you array here..
}
```


## Running the project locally

Run:

```bash 
git clone https://github.com/somebodyouknow66/scriblinlife.git
```

Then install all the packages:

``` bash
npm install
```

To start the project run:

``` bash
npm run dev
```