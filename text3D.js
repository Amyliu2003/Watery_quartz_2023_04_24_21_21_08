

import * as THREE from 'three';
// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as BufferGeometryUtils from 'bufferGeometry';

let port;
let socket;
let user2DInputArray = [];
let user2DInput = "";
let user2DQuestions = "";
let user2DQuestionArray = [];
let user2DAnswers = "";
let user2DAnswersArray = [];
let realDisplay = "<div>👋 🔶🚫🤖 🔶🚫🧑  🔶❌🗣️💬🇺🇸🇬🇧   🔶❌🗣️💬🧑🗺️   🔶✅💬😃🤣😢   🔶✅🗣️🔈➿</div><div>🧑💬🔶 🧑💬😃🤣😢 🧑💬⌨️⍠␂💬␃</div>";
let cloud, originalPositions;
let amplitude = 0.05;
let answerArrive=false;

let debounceTimer;
const debounceInterval = 100; // milliseconds
const geometries = [];
const map = (val, smin, smax, emin, emax) => (emax - emin) * (val - smin) / (smax - smin) + emin
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

   
var cloudNumber = 10;



async function getPort() {
    try {
        const response = await fetch('/get-port'); // No need to hardcode localhost
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
            input: "Hello from 3D"
        };
        socket.send(JSON.stringify(messageToSend));
    });

    socket.addEventListener('message', function (event) {
        console.log("Raw message received:", event.data); // Add this for debugging
        refreshText();

        if (event.data instanceof Blob) {
            if (event.data.size > 0) {
                const reader = new FileReader();
                reader.onload = function () {
                    console.log("Processed Blob message:", reader.result); // Add for debugging
                    processMessage(reader.result);
                };
                reader.readAsText(event.data);
            } else {
                console.log('Received an empty Blob, ignoring.'); // Change the handling here
            }
        } else {
            console.log("Processed string message:", event.data); // Add for debugging
            processMessage(event.data);
        }
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

function processMessage(data) {
    // console.log('Message from server that is being processed: ', data);
    if (data.includes("2D user is saying: ")) {
        const user2DInputArray = data.split("2D user is saying: ");
        const user2DInput = user2DInputArray[1];
        realDisplay = user2DInput;
        answerArrive=false;
        // console.log("3D is hearing:" + user2DInput);
    } else if (data.includes("2D user just said ")) {
        const user2DQuestionArray = data.split("2D user just said ");
        const user2DQuestions = user2DQuestionArray[1];
        realDisplay = user2DQuestions;

        answerArrive=true;
    } else if (data.includes("Thy being respond: ")) {
        const user2DAnswersArray = data.split("Thy being respond: ");
        const user2DAnswers = user2DAnswersArray[1];
        console.log(user2DAnswersArray);
        realDisplay = user2DAnswers;
        answerArrive=false;
    }
    console.log("current 2D events: " + realDisplay);

    if (realDisplay.length > 35) {
        realDisplay = breakTextIntoLines(realDisplay, 35);
    }
    

    textInputEl.innerHTML = "<div>   "+ realDisplay+"  </div>"; // Update the text input element

    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
        textInputEl.innerHTML = "<div>   "+ realDisplay+"  </div>";
        storeAndResetInput();
        handleInput();
        refreshText();
    }, debounceInterval);
}

function breakTextIntoLines(text, maxLineLength) {
    let newText = "";
    let lineLength = 0;

    for (let i = 0; i < text.length; i++) {
        newText += text[i];
        lineLength++;

        if (lineLength >= maxLineLength) {
            if (text[i] === ' ' || text[i+1] === ' ' || i === text.length - 1) {
                // Break at space or end of text
                newText += '  </div><div>  ';
                lineLength = 0;
            }
        }
    }

    return newText;
}



// DOM selectors
const containerEl = document.querySelector(".container");
const textInputEl = document.querySelector("#text-input");
const textInputRe = document.querySelector("#text-input-replace");

// Settings
const fontName = "Verdana";
const textureFontSize = 25;
const fontScaleFactor = 0.18;

// We need to keep the style of editable <div> (hidden inout field) and canvas
textInputEl.style.fontSize = textureFontSize + "px";
textInputEl.style.font = "100 " + textureFontSize + "px " + fontName;
textInputEl.style.lineHeight = 1.1 * textureFontSize + "px";

// 3D scene related globals
let scene,
    camera,
    renderer,
    textCanvas,
    textCtx,
    particleGeometry,
    particleMaterial,
    instancedMesh,
    dummy,
    clock,
    cursorMesh;

// String to show
let string = "";
// let stringA = "Typing<div>animation😘</div>";
let stringB = "";
let toggle = false;

// Coordinates data per 2D canvas and 3D scene
let textureCoordinates = [];
let particles = [];
let colors = [];
let localColors = [];

// Parameters of whole string per 2D canvas and 3D scene
let stringBox = {
    wTexture: 0,
    wScene: 0,
    hTexture: 0,
    hScene: 0,
    caretPosScene: [],
};

// ---------------------------------------------------------------

textInputEl.innerHTML = "   "+ realDisplay+"  ";
textInputRe.innerHTML = stringB;
document.getElementById("text-input").style.opacity = "0";
// document.getElementById("text-input").style.marginBottom = +" ";
// document.getElementById("text-input-replace").style.display = "none";
// textInputEl.focus();

// ---------------------------------------------------------------

init();
createEvents();
// setCaretToEndOfInput();
// handleInput();
refreshText();
render();

// ---------------------------------------------------------------

function init() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 18;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerEl.appendChild(renderer.domElement);

    textCanvas = document.createElement("canvas");
    textCanvas.willReadFrequently = true;
    textCanvas.width = textCanvas.height = 0;
    textCtx = textCanvas.getContext("2d");

    particleGeometry = new THREE.TorusGeometry(0.1, 0.05, 16, 50);
    particleMaterial = new THREE.MeshNormalMaterial({});

    dummy = new THREE.Object3D();
    clock = new THREE.Clock();

    //cursor
    const cursorGeometry = new THREE.BoxGeometry(0.3, 4.5, 0.03);
    cursorGeometry.translate(0.1, -2.3, 0);
    const cursorMaterial = new THREE.MeshNormalMaterial({
        transparent: true,
    });
    cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
    scene.add(cursorMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const mergedGeometry = createCloud();
    originalPositions = Float32Array.from(mergedGeometry.attributes.position.array);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://realtimevfx.com/uploads/default/original/3X/3/0/304a0f6fba7a2d8f4394f57216df0832c4564e1e.png', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(1, 1);
    });

    const material = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        emissive: 0x666CC,
        transparent: true,
        opacity: 0.7,
        map: texture,
        side: THREE.DoubleSide
    });

    cloud = new THREE.Mesh(mergedGeometry, material);
    cloud.position.set(0,3,10);
    scene.add(cloud);


}
// ---------------------------------------------------------------          


function createMainCloudSpheres() {
    const mainShape = [];

    mainShape.push(new THREE.SphereGeometry(1.2, 14, 16).translate(-1.5, -0.1, 0));
    mainShape.push(new THREE.SphereGeometry(1.2, 14, 16).translate(2, -0.3, 0));
    mainShape.push(new THREE.SphereGeometry(2, 14, 16).translate(0, 0, 0));

    return mainShape;
}



// Function to create cloudlets
function createCloudlets(mainShape, numCloudlets) {
    const cloudlets = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < numCloudlets; i++) {
        // Calculate the spherical coordinates for even distribution using golden ratio
        const t = i / numCloudlets;
        const inclination = Math.acos(1 - 2 * t); // theta
        const azimuth = angleIncrement * i; // phi

        // Randomly select one of the main spheres
        const selectedGeometry = mainShape[Math.floor(Math.random() * mainShape.length)];
        const radius = selectedGeometry.parameters.radius;

        const sphereWorldPosition = new THREE.Vector3();
        selectedGeometry.computeBoundingBox();
        sphereWorldPosition.addVectors(selectedGeometry.boundingBox.min, selectedGeometry.boundingBox.max);
        sphereWorldPosition.multiplyScalar(0.5);

        // Convert spherical coordinates to Cartesian coordinates for the cloudlet position
        const x = radius * Math.sin(inclination) * Math.cos(azimuth);
        const y = radius * Math.sin(inclination) * Math.sin(azimuth);
        const z = radius * Math.cos(inclination);

        const size = map(Math.random(), 0, 1, 0.1, 0.5);
        const cloudletGeometry = new THREE.SphereGeometry(size, 16, 16);
        const cloudletPosition = new THREE.Vector3(x, y, z).add(sphereWorldPosition);
        cloudletGeometry.translate(cloudletPosition.x, cloudletPosition.y, cloudletPosition.z);

        cloudlets.push(cloudletGeometry);
    }
    return cloudlets;
}


function chopBottom(geometry, bottom) {
    const positions = geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
        positions[i] = Math.max(positions[i], bottom);
    }
    geometry.attributes.position.needsUpdate = true;
}

// Main function to create the cloud
function createCloud() {
    const mainShape = createMainCloudSpheres();
    const cloudlets = createCloudlets(mainShape, 850);


    const bufferGeometries = mainShape.concat(cloudlets);

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(bufferGeometries, false);
    chopBottom(mergedGeometry, -0.2);
    return mergedGeometry;
}
// ---------------------------------------------------------------
function storeAndResetInput() {
    // Step 1: Store the current input
    // console.log("RESET!!");
    toggleInputs();

    // Step 2: Clear the text input and related data structures
    textureCoordinates = [];
    localColors = [];
    particles = [];

    // Reinitialize structures if necessary (e.g., reset scene, camera)

    // Step 3: Load the stored input back into the text input
    toggleInputs();
}

function toggleInputs() {
    // Swap the contents
    if (toggle) {
        toggle = false;
    } else {
        toggle = true;
    }
}

function createEvents() {
    document.addEventListener("keyup", () => {
        console.log("just key up");
        storeAndResetInput();
        handleInput();
        refreshText();
    });

    document.addEventListener("click", () => {
        console.log("just click");
        console.log(textInputEl.innerHTML);
        storeAndResetInput();
        document.querySelector(".intro").style.display = "none";
        textInputEl.focus();
        setCaretToEndOfInput();
        handleInput();
        refreshText();
    });
    // textInputEl.addEventListener("blur", () => {
    // textInputEl.focus();
    // });
    textInputEl.addEventListener("focus", () => {
        console.log("just focus");
        clock.elapsedTime = 0;
    });

    window.addEventListener("resize", () => {
        console.log("just resize");
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function setCaretToEndOfInput() {
    // Focus the text input element
    textInputEl.focus();

    // Create a range and selection
    const range = document.createRange();
    const selection = window.getSelection();

    // Ensure there's a child node to set the range
    if (textInputEl.childNodes.length > 0) {
        const lastChild = textInputEl.childNodes[textInputEl.childNodes.length - 1];
        range.selectNodeContents(lastChild);
        range.collapse(false); // false to collapse to end

        // Clear any existing selections and apply the new range
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        // If there are no child nodes, append a temporary text node
        const textNode = document.createTextNode("");
        textInputEl.appendChild(textNode);
        range.selectNodeContents(textNode);
        range.collapse(false); // false to collapse to end

        selection.removeAllRanges();
        selection.addRange(range);

        // Optionally, remove the temporary node after focusing
        // textInputEl.removeChild(textNode);
    }
}

function handleInput() {
    console.log(realDisplay);
    if (isNewLine(textInputEl.firstChild)) {
        textInputEl.firstChild.remove();
    }
    if (isNewLine(textInputEl.lastChild)) {
        if (isNewLine(textInputEl.lastChild.previousSibling)) {
            textInputEl.lastChild.remove();
        }
    }

    if (toggle) {
        string = textInputRe.innerHTML
            .replaceAll("<p>", "\n")
            .replaceAll("</p>", "")
            .replaceAll("<div>", "\n")
            .replaceAll("</div>", "")
            .replaceAll("<br>", "")
            .replaceAll("<br/>", "")
            .replaceAll("&nbsp;", " ");

        stringBox.wTexture = textInputEl.clientWidth;
        stringBox.wScene = stringBox.wTexture * fontScaleFactor;
        stringBox.hTexture = textInputEl.clientHeight;
        stringBox.hScene = stringBox.hTexture * fontScaleFactor;
        stringBox.caretPosScene = getCaretCoordinates().map(
            (c) => c * fontScaleFactor
        );
    } else {
        string = textInputEl.innerHTML
            .replaceAll("<p>", "\n")
            .replaceAll("</p>", "")
            .replaceAll("<div>", "\n")
            .replaceAll("</div>", "")
            .replaceAll("<br>", "")
            .replaceAll("<br/>", "")
            .replaceAll("&nbsp;", " ");

        stringBox.wTexture = textInputEl.clientWidth;
        stringBox.wScene = stringBox.wTexture * fontScaleFactor;
        stringBox.hTexture = textInputEl.clientHeight;
        stringBox.hScene = stringBox.hTexture * fontScaleFactor;
        stringBox.caretPosScene = getCaretCoordinates().map(
            (c) => c * fontScaleFactor
        );
    }

    function isNewLine(el) {
        if (el) {
            if (el.tagName) {
                if (
                    el.tagName.toUpperCase() === "DIV" ||
                    el.tagName.toUpperCase() === "P"
                ) {
                    if (el.innerHTML === "<br>" || el.innerHTML === "</br>") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function getCaretCoordinates() {
        const selection = window.getSelection();

        // Check if there is a selection and it has at least one range
        if (!selection.rangeCount) {
            return [0, 0]; // Return some default values or handle this scenario appropriately
        }

        const range = selection.getRangeAt(0);
        const needsToWorkAroundNewlineBug =
            range.startContainer.nodeName.toLowerCase() === "div" &&
            range.startOffset === 0;

        if (needsToWorkAroundNewlineBug) {
            return [range.startContainer.offsetLeft, range.startContainer.offsetTop];
        } else {
            const rects = range.getClientRects();
            if (rects.length > 0) {
                return [rects[0].left, rects[0].top];
            } else {
                document.execCommand("selectAll", false, null);
                document.getSelection().collapseToEnd();
                return [0, 0]; // Again, return default values or handle as needed
            }
        }
    }
}

// ---------------------------------------------------------------

function render() {
    requestAnimationFrame(render);
    // updateCloudVertices(cloud.geometry, originalPositions, amplitude);
    
    if(answerArrive){
        cloud.rotation.y += 0.01;
    }else{
        cloud.rotation.y += 0.0005;
    }
    updateParticlesMatrices();
    updateCursorOpacity();
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000);
}

// ---------------------------------------------------------------
function refreshText() {
    sampleCoordinates(); // Assume this returns an array of colors matching the new texture coordinates

    // Reset particles array to ensure it matches the new localColors
    particles = localColors.map((color, index) => {
        // Calculate the position for each particle
        const position = [
            textureCoordinates[index].x * fontScaleFactor,
            textureCoordinates[index].y * fontScaleFactor,
        ];

        // Create a new particle with the corresponding color
        return new Particle(position, color);
    });

    // Now, particles and localColors should match
    console.log(
        `Particles and localColors are now synced: ${particles.length === localColors.length
        }`
    );

    

    recreateInstancedMesh(); // This will use the updated particles array
    makeTextFitScreen();
    updateCursorPosition();
}

// ---------------------------------------------------------------
// Input string to textureCoordinates

function sampleCoordinates() {
    localColors = [];
    // Draw text

    const lines = string.split(`\n`);
    const linesNumber = lines.length;
    textCanvas.width = stringBox.wTexture;
    textCanvas.height = stringBox.hTexture;
    textCtx.font = "100 " + textureFontSize + "px " + fontName;
    textCtx.fillStyle = "#2a9d8f";
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for (let i = 0; i < linesNumber; i++) {
        textCtx.fillText(
            lines[i],
            0,
            ((i + 0.8) * stringBox.hTexture) / linesNumber
        );
    }

    // Sample coordinates
    if (stringBox.wTexture > 0) {
        // Image data to 2d array
        const imageData = textCtx.getImageData(
            0,
            0,
            textCanvas.width,
            textCanvas.height
        );
        const imageMask = Array.from(
            Array(textCanvas.height),
            () => new Array(textCanvas.width)
        );
        for (let i = 0; i < textCanvas.height; i++) {
            for (let j = 0; j < textCanvas.width; j++) {
                imageMask[i][j] = imageData.data[(j + i * textCanvas.width) * 4] > 0;
            }
        }

        for (let i = 0; i < textCanvas.height; i++) {
            for (let j = 0; j < textCanvas.width; j++) {
                const index = (i * textCanvas.width + j) * 4;
                if (imageData.data[index + 3] > 0 && imageData.data[index] > 0) {
                    // Checking alpha to ensure the pixel is not transparent
                    // Assuming imageData is the ImageData object from your canvas
                    const r = imageData.data[index] / 255;
                    const g = imageData.data[index + 1] / 255;
                    const b = imageData.data[index + 2] / 255;
                    const color = new THREE.Color(r, g, b);
                    localColors.push(color);
                }
            }
        }

        if (textureCoordinates.length !== 0) {
            // Clean up: delete coordinates and particles which disappeared on the prev step
            // We need to keep same indexes for coordinates and particles to reuse old particles properly
            textureCoordinates = textureCoordinates.filter((c) => !c.toDelete);
            particles = particles.filter((c) => !c.toDelete);
            localColors = localColors.filter((c) => !c.toDelete);

            // Go through existing coordinates (old to keep, toDelete for fade-out animation)

            textureCoordinates.forEach((c) => {
                if (imageMask[c.y]) {
                    if (imageMask[c.y][c.x]) {
                        c.old = true;
                        if (!c.toDelete) {
                            imageMask[c.y][c.x] = false;
                        }
                    } else {
                        c.toDelete = true;
                    }
                } else {
                    c.toDelete = true;
                }
            });
        }

        // Add new coordinates
        for (let i = 0; i < textCanvas.height; i++) {
            for (let j = 0; j < textCanvas.width; j++) {
                if (imageMask[i][j]) {
                    textureCoordinates.push({
                        x: j,
                        y: i,
                        old: false,
                        toDelete: false,
                        color: localColors[(i * textCanvas.width + j) * 4],
                    });
                }
            }
        }
    } else {
        textureCoordinates = [];
    }

    // console.log("Texture coordinates and colors sampled:", textureCoordinates, localColors);

}

// ---------------------------------------------------------------
// Handling params of each particle

function Particle([x, y], color) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.rotationX = Math.random() * 2 * Math.PI;
    this.rotationY = Math.random() * 2 * Math.PI;
    this.rotationZ = Math.random() * 2 * Math.PI;
    this.scale = 0;
    this.color = color;

    this.deltaRotation = 0.2 * (Math.random() - 0.5);
    this.deltaScale = 0.03 + 0.1 * Math.random();

    this.toDelete = false;

    this.grow = function () {
        this.rotationX += this.deltaRotation;
        this.rotationY += this.deltaRotation;
        this.rotationZ += this.deltaRotation;

        if (this.toDelete) {
            this.scale -= this.deltaScale;
            if (this.scale <= 0) {
                this.scale = 0;
            }
        } else if (this.scale < 1) {
            this.scale += this.deltaScale;
        }

    };
}

// ---------------------------------------------------------------
// Handle instances

function updateParticleColors() {
    // Create a flat array to hold color values
    const colorArray = new Float32Array(particles.length * 3);

    // Populate the colorArray from localColors

    localColors.forEach((color, index) => {
        colorArray[index * 3] = color.r;
        colorArray[index * 3 + 1] = color.g;
        colorArray[index * 3 + 2] = color.b;
    });



    // Create a three.js color attribute using the colorArray
    const colorAttribute = new THREE.InstancedBufferAttribute(colorArray, 3);

    // Assign the color attribute to the instancedMesh geometry
    instancedMesh.geometry.setAttribute("color", colorAttribute);
    // console.log(instancedMesh.geometry.getAttribute("color"));

    colorAttribute.needsUpdate = true;

    // console.log("Particles updated:", particles);

}
// Call this function after localColors array has been created and populated
function recreateInstancedMesh() {
    // Remove the existing mesh from the scene if it exists
    if (instancedMesh) {
        scene.remove(instancedMesh);
    }

    // Create the particle material with vertexColors set to true

    particleMaterial = new THREE.MeshBasicMaterial({
        vertexColors: true,
    });

    // This should render your particles in red. If it does, your mesh and material setup are likely correct.

    // Create a new instanced mesh with the particle geometry and material
    instancedMesh = new THREE.InstancedMesh(
        particleGeometry,
        particleMaterial,
        particles.length
    );

    // Add the instanced mesh to the scene
    scene.add(instancedMesh);

    // Check for correct length and values

    // Update the position of the instanced mesh
    instancedMesh.position.x = -0.5 * stringBox.wScene;
    instancedMesh.position.y = -0.5 * stringBox.hScene;

    // Now update the colors after the mesh has been created
    updateParticleColors(); // Call the function to update the colors
}

function updateParticlesMatrices() {
    let idx = 0;
    particles.forEach((p) => {
        p.grow();
        
        dummy.rotation.set(p.rotationX, p.rotationY, p.rotationZ);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.position.set(p.x, stringBox.hScene - p.y, p.z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(idx, dummy.matrix);
        idx++;
    });
    // console.log("Updating particle matrices at index:", idx);

    instancedMesh.instanceMatrix.needsUpdate = true;
}

// ---------------------------------------------------------------
// Move camera so the text is always visible

function makeTextFitScreen() { 
    console.log("Camera adjusted for text fitting:", camera.position);
    
    const fov = camera.fov * (Math.PI / 180);
    const fovH = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    const desiredDX = Math.abs((0.55 * stringBox.wScene) / Math.tan(0.5 * fovH));
    const desiredDY = Math.abs((0.55 * stringBox.hScene) / Math.tan(0.5 * fov));
    const desiredDistance = Math.max(desiredDX, desiredDY);

    const minDistance = 18; // Example minimum distance
    const maxDistance = 200; // Example maximum distance
    const adjustedDistance = clamp(desiredDistance, minDistance, maxDistance);

    // Interpolate the camera position
    const interpolationFactor = 1; // Adjust for smooth transition
    const previousDistance=camera.position.z;
    camera.position.z += (adjustedDistance - camera.position.z) * interpolationFactor;

    console.log("Camera adjusted for text fitting after:", camera.position);

    console.log("cloud scale:", cloud.scale);
    console.log("cloud position : ", cloud.position);

    const distanceRatio = camera.position.z/previousDistance;
    cloud.scale.x *= distanceRatio;
    cloud.scale.y *= distanceRatio;
    cloud.scale.z *= distanceRatio;

    console.log("cloud position after:", cloud.position);
    console.log("cloud scale after:", cloud.scale);

    console.log("Camera adjusted for text fitting after:", camera.position);


}

// ---------------------------------------------------------------
// Cursor related

function updateCursorPosition() {
    // console.log("Cursor position updated:", cursorMesh.position);
    cursorMesh.position.x = -0.5 * stringBox.wScene + stringBox.caretPosScene[0];
    cursorMesh.position.y = 0.5 * stringBox.hScene - stringBox.caretPosScene[1];
    // console.log("Cursor position updated:", cursorMesh.position);

}

function updateCursorOpacity() {
    let roundPulse = (t) =>
        Math.sign(Math.sin(t * Math.PI)) * Math.pow(Math.sin((t % 1) * 3.14), 0.2);
    if (document.hasFocus() && document.activeElement === textInputEl) {
        cursorMesh.material.opacity = roundPulse(2 * clock.getElapsedTime());
    } else {
        cursorMesh.material.opacity = 0;
    }
}
