const express = require('express');
const cors = require('cors');
const net = require('net');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
// const { send } = require('vite');




let currentPort;
let isSetupComplete = false;
let aiResponse="";
let portExist=false;


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const startServer = async () => {

    const CharacterAI = require('node_characterai');
    const characterAI = new CharacterAI();
    const emojiAI = new CharacterAI();
    const characterId = "EclSsUBrfVz-ISeCOEOpr1vFuHBLq-icAzdgZhDBg-E"; // QVVsQQ==
    const emojiId = "qAWKBcXBkWay35un5xv9Hy9kVeZs5qj-1lFzGrWBDDk";

    await characterAI.authenticateAsGuest();
    const auraChat = await characterAI.createOrContinueChat(characterId);

    await emojiAI.authenticateAsGuest();
    const emojiChat = await emojiAI.createOrContinueChat(emojiId);

    isSetupComplete = true;

    // Create an HTTP server from the Express app
    const server = http.createServer(app);

    // Create a WebSocket Server attached to the HTTP server
    const wss = new WebSocket.Server({ server:server });


    //   async function sendTextToEmojiCharacter(text) {
    //     const initialresponse = await emojiChat.sendAndAwaitResponse(text, true);
    //     return initialresponse.text;
    //   }

    async function interactWithAI(inputText) {
        if (!isSetupComplete) {
            throw new Error('AI setup not complete');
        }

        const initialResponse = await auraChat.sendAndAwaitResponse(inputText, true);
        console.log('Initial response:', initialResponse.text);

        // Create a new emoji chat session for each request
        const emojiChat = await emojiAI.createOrContinueChat(emojiId);
        const emojiResponse = await emojiChat.sendAndAwaitResponse("Translate the following sentence to emoji, word by word butignore all pronouns and articles, keep all the connectives and punctuation, reply the rest only with emoji : " + initialResponse.text, true);
        console.log('Emoji response:', emojiResponse.text);

        return {
            text: emojiResponse.text,
            initialResponse: initialResponse.text,
            emojiResponse: emojiResponse.text
        };
    }

    app.post('/send-user-input', async (req, res) => {
        try {
            const userInput = req.body.input;
            aiResponse = await interactWithAI(userInput);
            res.json(aiResponse);
        } catch (error) {
            console.error('Error in Express route:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    wss.on('connection', (ws) => {

        console.log("a new client is here!");
        ws.send("Hello client!");

        ws.on('message', async (message) => {
            try {
                const messageString = message.toString();

                // Assuming the message is a JSON string
                const messageData = JSON.parse(messageString);
                console.log('Parsed message data:', messageData.input);
                // console.log(typeof(messageData.input));
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(messageData.input);
                    }
                });
                  
            } catch (error) {
                console.error('Error in WebSocket message:', error);
                ws.send(JSON.stringify({ error: error.message }));
            }
        });
    });

    function findAvailablePort(startPort, callback) {
        const server = net.createServer();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${startPort} is in use. Trying ${startPort + 1}...`);
                findAvailablePort(startPort + 1, callback);
            } else {
                callback(err, null);
            }
        });

        server.listen(startPort, () => {
            const availablePort = server.address().port;
            server.close(() => {
                console.log(`Found available port: ${availablePort}`);
                callback(null, availablePort);
            });
        });


    }

    const initialPort = process.env.PORT || 3000;

    findAvailablePort(initialPort, (err, availablePort) => {
        if (err) {
            console.error('Error finding available port:', err);
            process.exit(1);
        }


        server.listen(availablePort, () => {
            console.log(`Server is running at http://localhost:${availablePort}`);
        });
        

        currentPort = availablePort;
        portExist=true;

        app.get('/get-port', (req, res) => {
            res.json({ port: currentPort });
        });
    });

    if(portExist){
        await setupVite(currentPort);
    }
   
}

startServer();
