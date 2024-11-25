// all libraries import
const express = require('express')
const app = express()
const port = 2000
const cors = require('cors')
const fileUpload =  require('express-fileupload')
const {connectMongoose} = require('./db/connectDb')
const { fileModel } = require('./models/fileUpload')


// setup cors
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))
// express usage
app.use(express.json())

// testing if the code is working on web local server 
app.get('/', (req, res)=>{
    res.send("app is running")
})
// file upload usage
app.use(fileUpload())



// file upload source code 
// app.post('/upload', async function(req, res) {

//     let fileUpload;
//     let uploadPath;
//     let fileName;

//     if (!req.files || Object.keys(req.files).length === 0) {
//         res.status(400).send('No files were uploaded.');
//         return;
//       }
//       console.log('req.files >>>', req.files); // eslint-disable-line

//         fileUpload = req.files.file; // enable it to accept all types of files
//         const fileMaxSize = 50 * 1024 * 1024 // accept maximum file size of 50mb
//         if(fileUpload.size > fileMaxSize){
//             res.json({error: " file file exceeded 50mb"})
//         }
//         // file name with date 
//         fileName = '/uploads/' + new Date().getTimezoneOffset() + fileUpload.name;

//         uploadPath = __dirname + '/uploads/' + fileUpload.name;

//         fileUpload.mv(uploadPath, function(err) {
//             if (err) {
//                 return res.status(500).send(err);
//                 }
//         })

//         const uploadResult = new fileModel({
//             fileName : uploadPath
//         })
//         await uploadResult.save()

//         if(!uploadResult){
//             res.json({error: "file was not uploaded"})
//         }
//         res.json("file uploaded successfully " + fileName)
//   });


// the code below will help in uploadind files
app.post('/upload', async (req, res) => {
    let blogFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log('req.files >>>', req.files); 

    blogFile = req.files.fileName;

    // to generate file name
    const uniqueSuffix = new Date().getTimezoneOffset() + '-' + blogFile.name;
    fileName = '/uploads/' + uniqueSuffix;

    // this is the file path
    uploadPath = __dirname + '/uploads/' + blogFile.name;

    // Move the file to the upload directory
    blogFile.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
    });

    // Save file information to the database
    const newFile = await fileModel.create({ fileName: uploadPath });
    // the message you get when you upload file successfully
    res.json({
        message: 'File uploaded successfully',
        newFile,
    });
});


app.listen(port, async() => {
    console.log(`Server started on ${port}`);
    await connectMongoose()

});