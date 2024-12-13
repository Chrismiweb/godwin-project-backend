// // all libraries import
// const express = require('express')
// const port = 2000
// const cors = require('cors')
// const fileUpload =  require('express-fileupload')
// const {connectMongoose} = require('./db/connectDb')
// const { fileModel } = require('./models/fileUpload')
// const { router } = require('./routes/routes')
// const http = require("http");
// const { Server } = require("socket.io");
// const { v4: uuidv4 } = require('uuid'); // Install using npm: npm install uuid







// // real life server config with socket.io 
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST'],
//     },
//   });

// // setup cors
// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200 
// }
// app.use(cors(corsOptions))
// // express usage
// app.use(express.json())

// // router usage
// app.use('/', router)
// // testing if the code is working on web local server 
// app.get('/', (req, res)=>{
//     res.send("app is running")
// })
// // file upload usage
// app.use(fileUpload())

// // Route to generate a unique room link
// app.get('/create-room', (req, res) => {
//     const roomId = uuidv4(); // Generate a unique room ID
//     res.json({ roomId, link: `https://godwin-project-backend.onrender.com/join/${roomId}` });
// });

// // socket.io code usage
// // io.on("connection", (socket) => {
// //     console.log("User connected:", socket.id);
  
// //     socket.on("offer", (data) => {
// //       socket.broadcast.emit("offer", data);
// //     });
  
// //     socket.on("answer", (data) => {
// //       socket.broadcast.emit("answer", data);
// //     });
  
// //     socket.on("ice-candidate", (data) => {
// //       socket.broadcast.emit("ice-candidate", data);
// //     });
  
// //     socket.on("disconnect", () => {
// //       console.log("User disconnected:", socket.id);
// //     });
// //   });
  
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join-room", (roomId) => {
//       socket.join(roomId);
//       console.log(`User ${socket.id} joined room ${roomId}`);
//   });

//   socket.on("offer", (data) => {
//       socket.to(data.roomId).emit("offer", data.signalData);
//   });

//   socket.on("answer", (data) => {
//       socket.to(data.roomId).emit("answer", data.signalData);
//   });

//   socket.on("ice-candidate", (data) => {
//       socket.to(data.roomId).emit("ice-candidate", data.candidate);
//   });

//   socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//   });
// });

// // file upload source code 
// // app.post('/upload', async function(req, res) {

// //     let fileUpload;
// //     let uploadPath;
// //     let fileName;

// //     if (!req.files || Object.keys(req.files).length === 0) {
// //         res.status(400).send('No files were uploaded.');
// //         return;
// //       }
// //       console.log('req.files >>>', req.files); // eslint-disable-line

// //         fileUpload = req.files.file; // enable it to accept all types of files
// //         const fileMaxSize = 50 * 1024 * 1024 // accept maximum file size of 50mb
// //         if(fileUpload.size > fileMaxSize){
// //             res.json({error: " file file exceeded 50mb"})
// //         }
// //         // file name with date 
// //         fileName = '/uploads/' + new Date().getTimezoneOffset() + fileUpload.name;

// //         uploadPath = __dirname + '/uploads/' + fileUpload.name;

// //         fileUpload.mv(uploadPath, function(err) {
// //             if (err) {
// //                 return res.status(500).send(err);
// //                 }
// //         })

// //         const uploadResult = new fileModel({
// //             fileName : uploadPath
// //         })
// //         await uploadResult.save()

// //         if(!uploadResult){
// //             res.json({error: "file was not uploaded"})
// //         }
// //         res.json("file uploaded successfully " + fileName)
// //   });


// // the code below will help in uploadind files
// app.post('/upload', async (req, res) => {
//     let blogFile;
//     let uploadPath;

//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No files were uploaded.');
//     }

//     console.log('req.files >>>', req.files); 

//     blogFile = req.files.fileName;

//     // to generate file name
//     const uniqueSuffix = new Date().getTimezoneOffset() + '-' + blogFile.name;
//     fileName = '/uploads/' + uniqueSuffix;

//     // this is the file path
//     uploadPath = __dirname + '/uploads/' + blogFile.name;

//     // Move the file to the upload directory
//     blogFile.mv(uploadPath, function (err) {
//         if (err) {
//             return res.status(500).send(err);
//         }
//     });

//     // Save file information to the database
//     const newFile = await fileModel.create({ fileName: uploadPath });
//     // the message you get when you upload file successfully
//     res.json({
//         message: 'File uploaded successfully',
//         newFile,
//     });
// });


// app.listen(port, async() => {
//     console.log(`Server started on ${port}`);
//     await connectMongoose()

// });
// server.listen(5000, () => {
//     console.log("Server running on http://localhost:5000");
//   });

const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins; restrict this in production
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
    res.send("Video Call Backend is Running!");
});

// REST API to create a new room
app.get("/create-room", (req, res) => {
    const roomId = uuidv4(); // Generate a unique room ID
    res.json({ roomId }); // Respond with the new room ID
});

// Store active rooms and users
const rooms = {};

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle joining a room
    socket.on("join-room", (roomId) => {
        if (!rooms[roomId]) {
            rooms[roomId] = []; // Initialize room if it doesn't exist
        }
        rooms[roomId].push(socket.id); // Add user to the room
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Notify other users in the room
        socket.to(roomId).emit("user-joined", socket.id);
    });

    // Handle offer
    socket.on("offer", ({ roomId, signalData, to }) => {
        io.to(to).emit("offer", { signal: signalData, from: socket.id });
    });

    // Handle answer
    socket.on("answer", ({ signalData, to }) => {
        io.to(to).emit("answer", { signal: signalData, from: socket.id });
    });

    // Handle ICE candidate
    socket.on("ice-candidate", ({ candidate, to }) => {
        io.to(to).emit("ice-candidate", { candidate, from: socket.id });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // Remove user from rooms
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId]; // Clean up empty rooms
            }
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
