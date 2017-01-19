var express = require("express");
var app= express();

app.get("/", function(req, res){
    res.sendFile( '/home/ubuntu/workspace/voting-app/public/index.html');
});

app.listen(process.env.PORT, function(){
    console.log("app listening on port: ", process.env.PORT)
})