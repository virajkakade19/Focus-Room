const express=require('express');
const path = require('path');
const generateRtcToken=require('./token_generator') ;



const app=express();
const PORT=8000;

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));

})

app.get('/get_token/:channelname',(req,res)=>{
  const chname=req.params.channelname;
  console.log(chname);
  const token=generateRtcToken(chname);
  res.send(token);

})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(typeof(data));

});