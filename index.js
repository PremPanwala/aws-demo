const express=require('express')
const app=express();
require('dotenv/config')
const port=process.env.PORT || 3000;
const uuid=require('uuid/v4')
const  multer=require('multer')
const aws=require('aws-sdk')
const storage=multer.memoryStorage({
    destination:function(req,file,callback)
    {
        callback(null,'')
    }
})
const s3=new aws.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET
})
const upload=multer({storage}).single('image')

app.post('/awsupload',upload,(req,res)=>{
    console.log("Post Rute called ");
    const reqfile=req.file;
    let myfile=reqfile.originalname.split(".");
    let filetype=myfile[myfile.length-1];
    const params={
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${filetype}`,
        Body: reqfile.buffer
    }
    s3.upload(params,(error,data)=>{
        if(error){
            return res.status(404).send(error)
        } else {
            console.log("Passed in AWS upload",data);
            return res.status(200).send(data)
        }
        })
})






app.listen(port,()=>{
    console.log(`Server is up at ${port}`);
})