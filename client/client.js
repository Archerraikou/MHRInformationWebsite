const express = require('express');
const fs = require('fs');
const app = express();
app.listen(8000,()=>{
    console.log('Server is running on port ' + 8000);
})
app.use(express.static('pages'))

app.get("/*",(req,res)=>{
    res.status(404).send('<h1>Not found</h1>')
})