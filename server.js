const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const path=require('path')
const fileUpload=require('express-fileupload')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

const port=process.env.PORT ||5000

if(process.env.NODE_ENV==='production')
app.use(express.static(__dirname,'rpp/build'))





app.post('/api/upload',(req,res)=>{

    if(req.files===null)
    return res.status(400).json({msg:'No file uploaded'})

const file=req.files.file

file.mv(`${__dirname}/rpp/public/uploads/${file.name}`,e=>{
    if(e){
        console.log(e)
        return res.status(500).json({err:e})
    }

 return    res.json({fileName:file.name,filePath:`/uploads/${file.name}`})

})

})


app.get('*',(req,res)=>{
res.sendFile(path.join(__dirname,'rpp/build','index.html'))
})






app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})