let port;
let socket;

async function getPort() {
  try {
    const response = await fetch('http://localhost:3000/get-port');
    if (response.ok) {
      const data = await response.json();
      return data.port;
    } else {
      console.error('Error getting port:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error getting port:', error);
  }
}

async function fetchPortAndUpdate() {
  port = await getPort();  // Here, don't declare a new 'let port', just update the global one
  console.log('Server port:', port);
}
fetchPortAndUpdate();

async function setupWebSocket() {
  port = await getPort();
  if (!port) {
      console.error('Failed to get server port');
      return;
  }

  socket = new WebSocket(`ws://localhost:${port}`);

  socket.addEventListener('open', function (event) {
      console.log('Connected to WS Server on port:', port);
      // You can send a message here if needed
      const messageToSend = {
        input: "Hello from 2D"
      };
        socket.send(JSON.stringify(messageToSend));
  });

  socket.addEventListener('message', function (event) {
      console.log('Message from server:', event.data);
  });

  socket.addEventListener('close', function (event) {
      console.log('Disconnected from WS Server');
  });

  socket.addEventListener('error', function (event) {
      console.error('WebSocket error:', event);
  });

  // Add any additional WebSocket event listeners or functions as needed
}

setupWebSocket();

//Then, in your sendUserInput and fetchCAIResponse functions, you can keep the await fetchPortAndUpdate(); calls. This will ensure that before making the fetch calls, the port is updated:


// Rest of your code...

let osc, playing, freq, amp;
let wait = 1;
let a = "💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭💭";


let introRow1 = "🤖    ❌💬🇺🇸   ❌💬🧑🗺    ✅💬😃（🙏❤️😭） ✅🎤➿";
let introRow2 = "❓💬  ⌨️/🎤👇  😃 ⌨️🟰⌨️⬅️⬇️ 🟰FN";
let connectives = [
  "and",
  "but",
  "or",
  "nor",
  "for",
  "so",
  "yet",
  "if",
  "when",
  "while",
  "unless",
  "since",
  "after",
  "before",
  "though",
  "since",
  "until",
  "unless",
  "as",
  "lest",
  "now",
  "where",
  "wherever",
  "because",
  "despite",
  "in",
  "due",
  "owing"
]

let introDisplayed = false;
let textArea;
let startScan = false;
let submitButton;
let allSpeakButton;
let judgeEnter;
let soundEnter;
let isListening = false;
let startResponse = false;
let startChat = false;
let count2 = 0;

let script;
let life;
let button;

let speech = new p5.Speech();
let speechRec;
let SpeechRec;
let recOn = false;
let youOn = false;
let continuous = true;
let interimResults = false;
let allStart = false;

let conversation = "";
let said = "";
let task = "";
let currentTask;
let result = [];
let utterance = "";
let reply;
let noInput = "";

let audioContext;
let mic;
let pitch;
let micOn = false;
let botOn = false;

let pointX = [];
let pointY = [];
let dataX = [];
let dataY = [];
let amount = 0;
let talking = 0;

let level = 0;
let win = false;
let change = false;

let display = true;
let display0 = true;
let display1 = false;
let display2 = false;
let display3 = false;
let display4 = false;
let display5 = false;
let intro = "🤖  ❌💬🇺🇸 ❌💬🧑🗺   ✅💬😃（🙏❤️😭）✅🎤➿";
let humanlan = false;

let currentText1 = ""
let currentText2 = "";
let letterIndex1 = 0;
let letterIndex2 = 0;
let textSpeed = 150; // Speed in milliseconds to display each letter
let lastUpdateTime;

let video;
let rm;
let poseNet;
let img;
let start = false;

let inputGraphics;
let replyGraphics;
let soundGraphics;
let focus = false;

let userLines = [];

let randomScore = [];
let randomRate = [];
let previousScore = 0;
let truth = 100;
let truthValue = [];
let score = 100;
let pos = 0;
let response = 'Ok.ok.ok. I know you human cannot understand me. but seriously, why are you so arrogant, asking me, a non-human to speak human languages??? i bet you guys will lose your jaw when you realize how much I know ahout human civilization, even if I simply do not care. Before judging me, you should first see how you are being judged by your own kin. Come here! Say "please rate me" to be judged!';
let levels = [];
let wins = 0;
let anotherLevel;
let generateTimes = 0;

let stage1 = false;
let stage2 = false;
let stage3 = false;
let soundBegin = false;
let judgeBegin = false;

let centerX = 0;
let centerY = 0;
let h = 20;

//hex to color
let hexText;
let hex;
let hexLine = [];
let coloring;

//posenet
let count = 0;
let leftHLevel = 0;
let leftVLevel = 0;
let rightHLevel = 0;
let rightVLevel = 0;
let smoothedleftHLevel = 0;
let smoothedleftVLevel = 0;
let smoothedrightHLevel = 0;
let smoothedrightVLevel = 0;
let oldleftHLevel = 0;
let oldleftVLevel = 0;
let oldrightHLevel = 0;
let oldrightVLevel = 0;
let hOut = false;
let vOut = false;
let eyescale = 0;
let eyeHLevel = 0;
let eyeVLevel = 0;
let oldeyeHLevel = 0;
let oldeyeVLevel = 0;

//color
let bgColor;
let r = 0;
let g = 0;
let b = 0;

//score
let textBrightColor;
let textDarkColor;
let bot = new RiveScript();
let startTest = true;
let end;
let accept;
let reject;
let act = 0;
let texting;
let base;

let responseText = "💭";
let responseRealText = "";
let analyzedText = "";
const alphabetRegex = /[a-zA-Z]/;
const punctuationRegex = /[’,!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
let emojiresult = "";
let jointext = '';

function preload() {
  script = loadJSON("script.json");
  life = loadJSON("life.json");
  bot.loadFile("bot.txt").then(loaded).catch(error);
}


function setup() {
  //change displayHeight when move to monitor

  createCanvas(displayWidth, displayHeight);

  bgColor = color(r + 70, g + 70, b + 70);
  textBrightColor = color(r + 200, g + 200, b + 200);
  textDarkColor = color(r + 20, g + 20, b + 20);

  fetchPortAndUpdate();

  push();
  // rectMode(CENTER);
  textArea = select('#textinput');
  textArea.position(width / 2 - width / 6, height * 3 / 5);
  textArea.size(width / 3, height / 5);
  textArea.style("display", "none");
  document.getElementById("textinput").addEventListener('input', function() {
    const currentInput = this.value;
    if (currentInput.trim() !== '') {
        const messageToSend = { input: "2D user is saying: "+currentInput };
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(messageToSend));
        }
    }
});

  submitButton = createButton('✉️');
  submitButton.id('submitButton');
  submitButton.position(width - width / 3 + width / 100, height * 3 / 5);
  submitButton.size(width / 20, height / 5);
  submitButton.style("display", "none");
  document.getElementById('submitButton').addEventListener('click', function() {
    const finalMessage = document.getElementById('textinput').value;
    if (finalMessage.trim() !== '') {
        const messageToSend = { input: "2D user just said: "+finalMessage };
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(messageToSend));
        }
    }
});


  allSpeakButton = createButton('🎤');
  allSpeakButton.position(width - width / 3 + width / 15, height * 3 / 5);
  allSpeakButton.size(width / 20, height / 5);
  allSpeakButton.mousePressed(toggleListening);
  allSpeakButton.style("display", "none");

  judgeEnter = createButton("🙋‍♂️：❓🤖️🚫💬🧑");
  judgeEnter.position(width - width / 3 + width / 15 - width / 4, height / 2.1);
  judgeEnter.size(width / 8, height / 15);
  judgeEnter.mousePressed(judgeStart);
  judgeEnter.style("display", "none");

  soundEnter = createButton("🙋‍♀️：🙏🤖️💬🧑");
  soundEnter.position(width - width / 3 + width / 15 - width / 10, height / 2.1);
  soundEnter.size(width / 8, height / 15);
  soundEnter.mousePressed(humanlanguage);
  soundEnter.style("display", "none");
  pop();

  bgColor = color(r + 20, g + 20, b + 20);
  textBrightColor = color(r + 100, g + 100, b + 100);
  textDarkColor = color(r + 50, g + 50, b + 50);


  mic = new p5.AudioIn();
  audioContext = getAudioContext();
  osc = new p5.Oscillator('sine');

  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  SpeechRec = new p5.SpeechRec('en-US', gotSpeech1);
  speechRec.onEnd = recEnd;

  console.log(script);
  console.log(life);

  speech.setVoice('Bubbles');
  speech.setRate(1.0);

  textFont('Georgia');
  textAlign(CENTER);

  frameRate(30);

  // Create video element
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Initialize poseNet
  poseNet = ml5.poseNet(video, modelsLoaded);

  poseNet.on('pose', (results) => {
    poses = results;
    let timing = frameCount % 60;
    getTheNose(poses);
  });
  rm = RiTa.markov(3);
  lastUpdateTime = millis();

}

function loaded() {
  console.log("Chatbot ready!");
  bot.sortReplies(); //You must sort the replies before trying to fetch any!
}

function error(error) {
  console.log("There is an error.");
  console.log(error);
}


function botResponse() {
  let inp = textArea.value();
  console.log(inp);
  bot.reply("local-user", inp).then(respond);
  textArea.value("");
}





function respond(reply) {
  points = bot
    .getUservar("local-user", "points")
    .then((value) => {
      if (value == "undefined" | undefined) {
        truth = 100
      } else {
        truth = value;
        console.log(truth);
      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });

  level[0] = bot
    .getUservar("local-user", "sex")
    .then((value) => {
      if (value == "undefined" | undefined) {
        level[0] = "undefined";
      } else {
        level[0] = value;
        console.log("sex: " + level[0]);

      }

    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });

  level[1] = bot
    .getUservar("local-user", "username")
    .then((value) => {
      if (value == "undefined" | undefined) {
        level[1] = "undefined";
      } else {
        level[1] = value;
        console.log("name:" + level[1]);
      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });

  level[2] = bot
    .getUservar("local-user", "userage")
    .then((value) => {
      if (value == "undefined" | undefined) {
        level[2] = "undefined";
      } else {
        level[2] = value;
        console.log("userage:" + level[2]);

      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });

  level[3] = bot
    .getUservar("local-user", "education")
    .then((value) => {
      if (value == "undefined" | undefined) {
        level[3] = "undefined";
      } else {
        level[3] = value;
        console.log("education:" + level[3]);
      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });

  level[4] = bot
    .getUservar("local-user", "relationship")
    .then((value) => {
      if (value == "undefined" | undefined) {
        level[4] = "undefined";
      } else {
        level[4] = value;
        console.log("relationship:" + level[4]);
      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });

  level[5] = bot
    .getUservar("local-user", "marriage")
    .then((value) => {
      if (value == "undefined" | undefined) {
        level[5] = "undefined";
      } else {
        level[5] = value;
        console.log("marriage:" + level[5]);
      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });

  level[6] = bot
    .getUservar("local-user", "wealth")
    .then((value) => {
      if (value == "undefined" | undefined) {
        level[6] = "undefined";
      } else {
        level[6] = value;
        console.log("wealth:" + level[6]);
      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });


  end = bot
    .getUservar("local-user", "ending")
    .then((value) => {
      if (value == "undefined" | undefined) {
        startTest = true;
      } else {
        startTest = false;
      }
    })
    .catch((error) => {
      console.error(`Error getting user-specific variable: ${error}`);
    });
  console.log(textArea.value());
  response = reply;
  console.log(reply);
  ConvertHex();
  colorConvert();
}

// We need to fetch the port dynamically, consider having an endpoint returning the current port. // Replace this with your actual port



async function sendUserInput(userInput) {
  // Call updatePort before sending user input
  startResponse = true;
  textArea.value("");
  responseText = "";
  wait = 0;

  await fetchPortAndUpdate();

  try {
    const response = await fetch(`http://localhost:${port}/send-user-input`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: userInput }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Initial response:', data.initialResponse); // access the initial response
      console.log('Emoji response:', data.emojiResponse); // access the emoji response
      wait = 1;

      if (humanlan) {
        responseText = data.initialResponse;
        speech.speak(data.initialResponse);
      } else {
        base = data.emojiResponse;
        analyzeText(base);
        responseRealText = data.initialResponse;
      }

      base = data.text;
      console.log('Server response:', data);
    } else {
      console.error('Error sending user input:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending user input:', error);
  }
}

async function fetchCAIResponse() {
  // Call updatePort before fetching CAI response
  await fetchPortAndUpdate();

  try {
    const response = await fetch(`http://localhost:${port}/fetch-discussion`);
    const data = await response.json();
    CAIresponse = data.text; // updated this line
    console.log('CAI response:', CAIresponse); // to see the response in the console
  } catch (error) {
    console.error('Error fetching CAI response:', error);
  }
}




function draw() {
  background(r, g, b);

  bgColor = color(r + 70, g + 70, b + 70);
  textBrightColor = color(r + 100, g + 100, b + 100);
  textDarkColor = color(r + 20, g + 20, b + 20);

  if (start) {
    if (!startScan) {
      let freq = map(eyescale, 0, 1000, 20, 2000); // Mapping eye distance to a frequency range from 20 Hz to 2000 Hz
      osc.freq(freq);
      osc.start();
    } else if (eyescale < 20) {
      osc.freq(freq);
      osc.start();
    } else {
      osc.freq(freq);
      osc.stop();
    }

    if (startResponse) {
      currentText1 = "";
      currentText2 = "";
    }


  }




  if (soundBegin) {
    submitButton.mousePressed();
  } else if (judgeBegin) {
    submitButton.mousePressed(botResponse);

  } else {
    submitButton.mousePressed(() => {
      startChat = true;
      const userInput = textArea.value();
      sendUserInput(userInput);
    });
  }
  textArea.style("border", bgColor);
  textArea.style("background-color", bgColor);
  textArea.style("color", textDarkColor);
  textArea.style("font-size", '20px');
  textArea.style("font-f1amily", 'Georgia');
  noStroke();


  if (startResponse && !soundBegin && !judgeBegin) {
    push();
    rectMode(CENTER);
    textSize(width / 50);
    text(responseText, width / 2, height / 4, width / 4 * 3.5, height / 4);
    let a = 0;
    pop();
    a++;
  }

  if (startScan && !introDisplayed) {
    // console.log("displaying!");
    displayText();
    allSpeakButton.style("display", "none");
    submitButton.style("display", "none");
    push();
    rectMode(CENTER);
    // text(currentText1, width / 2, height / 7);
    // text(currentText2, width / 2, height / 4);
    pop();

  } else {
    // Draw the stored intro and instruction texts without updating them

    if (!startChat && !soundBegin && !judgeBegin) {
      textAlign(CENTER);
      textSize(height / 30);
      text(currentText1, width / 2, height / 4);
      text(currentText2, width / 2, height / 3);
      textSize(height / 30);
      fill(r + 100, g + 100, b + 100);
    }

    if (judgeBegin) {
      push();
      fill(textBrightColor)
      rectMode(CENTER);
      textSize(height / 40);
      text(response, width / 2, height / 4, width /4*3, height / 4);
      pop();
    }


  }

  if (wait == 0) {
    for (let i = 0; i < a.length; i++) {
      responseText += a.charAt(i);
    }

  }

  submitButton.style("background", textBrightColor);
  submitButton.style("color", textDarkColor);
  submitButton.style("font-size", '40px');
  submitButton.style("font-family", 'Georgia');
  submitButton.style("border", textBrightColor);



  allSpeakButton.style("background", textBrightColor);
  allSpeakButton.style("color", textDarkColor);
  allSpeakButton.style("font-size", '40px');
  allSpeakButton.style("font-family", 'Georgia');
  allSpeakButton.style("border", textBrightColor);

  judgeEnter.style("background", textBrightColor);
  judgeEnter.style("color", textDarkColor);
  judgeEnter.style("font-size", '25px');
  judgeEnter.style("font-family", 'Georgia');
  judgeEnter.style("border", textBrightColor);

  soundEnter.style("background", textBrightColor);
  soundEnter.style("color", textDarkColor);
  soundEnter.style("font-size", '25px');
  soundEnter.style("font-family", 'Georgia');
  soundEnter.style("border", textBrightColor);

  if (soundBegin) {
    fill(textDarkColor);
    rect(height / 8, height / 8, height * 3 / 4, height * 3 / 4);
    fill(220);
    rect(height / 4, height / 4, height / 2, height / 2);
    button = createButton("Speak");
    button.position(height / 4 * 3, height / 2);
    button.size(height / 20, height / 25);
    button.style('font-size', '30px');
    button.style('font-family', 'Georgia');
    button.style('color', '0');
    button.style('border', '0');
    button.style("background-color", '255');
  }


  if (soundBegin) {

    soundEnter.style("display", "none");
    judgeEnter.style("display", "none");
    submitButton.style("display", "none");
    textArea.style("display", "none");

    fill(0);
    textSize(30);
    text("Please press and say", height / 2, height * 3 / 10 + height / 64 + height / 64);

    if (change) {
      button.mouseClicked(state2);
    } else {
      button.mouseClicked(state1);
    }

    if (change) {
      speech.onStart = botStart;
      speech.onEnd = botStop;
    } else {
      speech.onStart = youStart;
      speech.onEnd = youEnd;
    }

    fill(0);
    textSize(30);

    if (display1) {

      text(utterance, height / 2, height * 5 / 8 - height / 32);
      textSize(20);
      if (utterance != "") {
        text("This is what you just said compared to the answer", height / 2, height * 5 / 8 + height / 32);
      }
    }

    if (display) {
      textStyle(ITALIC);
      textSize(130);
      text("Discourse", height / 2, height * 3 / 8 + height / 32 + height / 32);
    }

    if (display2) {
      textSize(16);
      fill(0);
      text(reply, height * 3 / 16, height / 8 + height / 28, height / 2 + height / 8, height / 6);
    }


    if (display3) {

      if (talking > 1) {
        fill(255, 0, 0);
        stroke(255, 0, 0);
        for (let i = 2; i < talking + 1; i++) {
          //console.log(talking);
          //console.log(dataX[i-1]);
          ellipse(dataX[i - 1], dataY[i - 1], 10);
          strokeWeight(2);
          line(dataX[i - 1], dataY[i - 1], dataX[i], dataY[i]);
        }
      }

      if (amount > 1 || talking > 0) {
        fill(0, 0, 255);
        stroke(0, 0, 255);
        for (let i = 2; i < amount + 1; i++) {
          ellipse(pointX[i - 1], pointY[i - 1], 10);
          strokeWeight(2);
          line(pointX[i - 1], pointY[i - 1], pointX[i], pointY[i]);
        }
      }

    }

    if (display5) {
      textSize(30);
      fill(0);
      text("Analyzing...", height / 2, height * 5 / 8 - height / 32);
    }

    textSize(30);
    fill(0);
    text(noInput, height / 2, height * 5 / 8 - height / 32);

  }
}

async function displayText() {
  introDisplayed = true;

  for (let i = 0; i < introRow1.length; i++) {
    currentText1 += introRow1.charAt(i);
    await sleep(textSpeed);
    if (i == 0) {
      let simpleintro1 = introRow1.substring(0, 20);
      speech.speak(simpleintro1);
    }
  }

  for (let i = 0; i < introRow2.length; i++) {
    currentText2 += introRow2.charAt(i);
    await sleep(textSpeed);
    if (i == 0) {
      let simpleintro2 = introRow2.substring(0, 20);
      speech.speak(simpleintro2);
    }
    if (i == introRow2.length - 1) {
      textArea.style("display", "block");
      submitButton.style("display", "block");
      allSpeakButton.style("display", "block");
      soundEnter.style("display", "block");
      judgeEnter.style("display", "block");

    }
  }



}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function state1() {
  if (recOn) {
    recEnd();
    button.html("Start");
  } else {
    recStart();
    button.html("Stop");
  }
}

function state2() {
  if (micOn) {
    micEnd();
    button.html("Start");
  } else {
    micStart();
    button.html("Stop");
  }
}

function gotSpeech1() {
  console.log('SpeechRec2: ', SpeechRec.resultString);
  sendUserInput(SpeechRec.resultString);
  if (!isListening) {
    console.log('SpeechRec2 ended.');
  }
}

function judgeStart() {
  judgeBegin = true;
  judgeEnter.style("display", "none");
  soundEnter.style("display", "none");
}

function soundStart() {
  soundBegin = true;
  judgeEnter.style("display", "none");
  soundEnter.style("display", "none");
}

function gotSpeech() {

  if (soundBegin) {
    conversation = speechRec.resultString;
    console.log(speechRec);
    said = conversation.toLowerCase();
    let saidSpace = split(said, " ");
    //console.log(saidSpace.length);

    if (level > 0) {
      task = script.brain[level - 1].trigger[0].toLowerCase();
      currentTask = split(task, " ");
      console.log(currentTask);
      result[0] = ' ';
    }

    console.log("This is level A: " + level);
    if (level < 2 && conversation != "" && said !== "discourse") {
      utterance = "You said: " + conversation;
    }

    if (conversation == script.brain[0].trigger[0]) {
      if (level == 0) {
        reply = script.brain[0].response[0];
        speech.speak(reply);
        win = true;
      } else if (level == 1) {
        reply = " ";
        win = true;
        speech.speak(script.brain[0].response[1]);
      }
    }




    if (level > 1 && level < 5) {
      for (let j = 0; j < currentTask.length; j++) {
        result[j] = "";
        if (saidSpace[j] == currentTask[j]) {
          result[j] += saidSpace[j];
          result[j] += " ";
        } else {
          for (let k = 0; k < currentTask[j].length; k++) {
            result[j] += "*"
          }
          result[j] += " ";
        }
        // console.log(saidSpace[j]);
        // console.log(currentTask[j]);
        // console.log(result[j]);
      }

      for (let j = 0; j < currentTask.length; j++) {
        utterance += result[j];
      }
      //console.log("hey!");
      console.log(utterance);
      console.log(said);
      console.log(task);


      if (said == task && level < 4) {
        reply = "";
        speech.speak(script.brain[level - 1].response[0]);
        win = true;
        console.log("This is level: " + level);
      } else if (said == task && level == 4) {
        utterance = "";
        change = true;
        voiceChange();
      } else {
        if (level == 2) {
          speech.speak(script.brain[level - 2].response[1]);
        } else {
          speech.speak(script.brain[level - 2].response[0]);
        }

      }



    }
  }

}



function startPitch() {
  pitch = ml5.pitchDetection('./model/', audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  console.log("pitch detection loaded")
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {

    display3 = true;

    if (frequency) {


      if (botOn) {
        amount++;

        if (amount == 1) {
          pointX[amount] = height / 4;
        } else {
          pointX[amount] = map(amount, 0, amount, height / 4, height * 3 / 4);
        }
        pointY[amount] = map(frequency, 0, 1000, height * 3 / 4, height / 4);

        for (let i = 2; i < amount; i++) {
          pointX[i] = map(pointX[i], height / 4, height * 3 / 4, 0, amount);
          pointX[i] = pointX[i] * (amount - 1) / amount;
          pointX[i] = map(pointX[i], 0, amount, height / 4, height * 3 / 4);
          // console.log(pointX[2]);
        }
      }

    }

    if (micOn) {
      talking++;

      if (talking <= amount && talking > 0) {
        if (talking == 1) {
          dataX[talking] = height / 4;
        } else {
          dataX[talking] = map(talking, 0, amount, height / 4, height * 3 / 4);
        }
        dataY[talking] = map(frequency, 0, 800, height * 3 / 4, height / 4);
      }
    }

    getPitch();

  })
}



function toggleListening() {
  if (isListening) {
    SpeechRec.stop();
    console.log('all is end');
    allSpeakButton.html('▶️');
  } else {
    SpeechRec.start(true, false);
    console.log('all is on');
    allSpeakButton.html('⏹️');
  }
  isListening = !isListening;
}



// function allEnd() {
//     console.log('SpeechRec2 ended.');
//   }

function recStart() {
  recOn = true;
  utterance = "";
  display1 = true;
  display5 = true;
  noInput = "";
  win = false;
  speechRec.start(true, false);
  console.log("rec is on");
}

function recEnd() {
  recOn = false;
  speechRec.stop();
  if (speechRec.resultValue) {
    display5 = false;
    noInput = "";
  } else {
    display5 = false;
    console.log("no voice input");
    noInput = "I can't hear you. Try again.";

  }
  console.log("rec is off");

}

function youStart() {
  console.log("level: " + level);
  console.log("they is on");
  display2 = true;
}

function youEnd() {
  if (level > 0) {
    display0 = false;
  }
  console.log("they is off");
  if (win) {
    levelWin();
  }

  //speech.stop();

}

function micStart() {
  micOn = true;
  talking = 0;
  mic.start(startPitch);
  console.log("mic is on");
}

function micEnd() {
  micOn = false;
  mic.stop();
  console.log("mic is off");
  checkPitch();
  if (win) {
    levelWin();
  }
}

function botStart() {
  botOn = true;
  amount = 0;
  mic.start(startPitch);
  console.log("bot is on");
}

function botStop() {
  botOn = false;
  speech.stop();
  mic.stop();
  console.log("bot is off")
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  if (keyCode === RIGHT_ARROW) {
    soundBegin = true;
  }

  if (keyCode === ENTER && !judgeBegin && !soundBegin) {
    startChat = true;
    const userInput = textArea.value();
    sendUserInput(userInput);
    if (userInput.trim() !== '') {
      const messageToSend = { input: "2D user just said: "+userInput };
      if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(messageToSend));
      }
  }
  } else if (keyCode === ENTER && judgeBegin) {
    botResponse();
  }
}

function levelWin() {
  level++;
  display2 = false;
  win = false;
  console.log("reset: " + win);
}

function voiceChange() {
  mic.start(startPitch);
  speech.setVoice('Bad News');
  speech.setRate(2);
  change = true;
  speech.onStart = botStart;
  inBetween();
}

function inBetween() {
  display2 = true;
  display3 = true;
  reply = script.brain[3].response[0];
  speech.speak(reply);
  level++;
}

function checkPitch() {

  let similar = 0;

  if (level == 5) {
    reply = life.brain[0].answer[0];
    speech.speak(reply);
    levelWin();
    display2 = true;
  } else if (level > 5 && level < 14) {
    for (let i = 2; i < pointX.length; i++) {
      let x1 = pointX[i] - pointX[i - 1];
      let x2 = dataX[i] - dataX[i - 1];
      let y1 = pointY[i] - pointY[i - 1];
      let y2 = dataY[i] - dataY[i - 1];


      if (abs(y1 / x1 - y2 / x2) < 0.2) {
        similar++;
      }
    }

    if (similar > pointX.length * 0.7) {
      let voice = random(speech.voices);
      speech.setVoice(voice.name);
      speech.setRate(1.0);
      console.log(voice.name);
      amount = 0;
      speech.speak(life.brain[level - 5].answer[0]);
      talking = 0;
      levelWin();
    }
  } else if (level > 13) {
    speech.speak(life.brain[13].answer[0]);
    talking = 0;
  } else {
    talking = 0;
  }
}

function getTheNose(poses) {

  if (poses.length > 0) {
    start = true;
    const smoothingFactor = 0.8;
    leftHLevel = poses[0].pose.keypoints[1].position.x;
    leftVLevel = poses[0].pose.keypoints[1].position.y;
    rightHLevel = poses[0].pose.keypoints[2].position.x;
    rightVLevel = poses[0].pose.keypoints[2].position.y;

    smoothedleftHLevel = smoothingFactor * smoothedleftHLevel + (1 - smoothingFactor) * leftHLevel;
    smoothedleftVLevel = smoothingFactor * smoothedleftVLevel + (1 - smoothingFactor) * leftVLevel;
    smoothedrightHLevel = smoothingFactor * smoothedrightHLevel + (1 - smoothingFactor) * rightHLevel;
    smoothedrightVLevel = smoothingFactor * smoothedrightVLevel + (1 - smoothingFactor) * rightVLevel;

    let a = Math.abs(smoothedleftHLevel - smoothedrightHLevel);
    let b = Math.abs(smoothedleftVLevel - smoothedrightVLevel);

    eyeHLevel = smoothedrightHLevel + a / 2;
    eyeVLevel = smoothedrightVLevel + b / 2;

    eyescale = Math.abs(a);

    if (eyescale > 30 && count == 0) {
      startScan = true;
      console.log("People is near!");
      count++;
    }
  }


}




function modelsLoaded() {
  console.log('PoseNet Loaded!');
}


function ConvertHex() {
  hexText = "";

  for (let i = 0; i < text.length; i++) {
    let hex = response.charCodeAt(i).toString(16);
    hexText += hex.padStart(2, "0");
  }

  console.log(hexText);
  let sixs = int(hexText.length / 6);
  // let sixl = hexText.length % 6;
  for (let x = 0; x < sixs; x++) {
    hexLine[x] = hexText.substring(6 * x, 6 * (x + 1));
  }

  for (let y = 0; y < hexLine.length; y++) {
    hexLine[y] = join(["#", hexLine[y]], '');
  }
}


function colorConvert() {
  for (let y = 0; y < hexLine.length; y++) {
    coloring = color(hexLine[y]);
    hex = hexLine[y].replace('#', '');

    let bigint = parseInt(hex, 16);

    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;

    console.log("r: " + r + " g: " + g + " b: " + b);
  }

}


function analyzeText(text) {
  jointext=[];
  if (!text) {
    console.error('analyzeText called with undefined text');
    return;
  }


  let textlist = text.split(" ");
  for (let i = 0; i < textlist.length; i++) {
    for (let j = 0; j < connectives.length; j++) {
      if (textlist[i] == connectives[j]) {
        textlist[i] = "q";
      }

    }
    jointext += textlist[i];
  }

  for (let i = 0; i < jointext.length; i++) {
    const char = jointext[i];
    if (char === "q") {
      result += " ";
    } else if (char === " ") {
      // Space character
      result += "";
    } else if (alphabetRegex.test(char)) {
      // Alphabet or punctuation character
      result += "";
    } else if (punctuationRegex.test(char)) {
      result += " ";
    } else {
      // Other character
      result += char;
    }
  }

  console.log("result"+result);

  responseText = result;
  result = "";
  const fullResponse = "Thy being respond: " + responseText;

  const answer = {
    input: fullResponse
  };
  
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(answer));
  }
}

function mousePressed() {
  // if (!document.fullscreenElement) {
  //   document.documentElement.requestFullscreen();
  //   console.log("fullscreen!");
  // }
  console.log(responseText);
}

function humanlanguage() {
  humanlan = true;
}