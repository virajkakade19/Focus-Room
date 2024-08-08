const express=require('express');
const path = require('path');



const app=express();
const PORT=8000;

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','home.html'));

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // console.log(typeof(data));
  
  });