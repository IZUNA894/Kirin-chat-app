var express = require("express");
var router = express.Router();
var RelMsg= require('../db/relMsg');
var auth = require('../middleware/auth_ware');

router.get("/mongo",function(req,res){
  res.send("hello from mongo db");
})

router.get('/msg/getMsg',async function(req,res)
{
   res.set("Content-Type","application/json");
   var usr1 = req.query.sender;
   var usr2 = req.query.reciever;
   var tokenId = usr1.length < usr2.length ? usr1+usr2 :usr2+usr1;
   console.log(tokenId);

   var msgs = await RelMsg.find({tokenId});
   if(msgs[0]){
   msgs= msgs[0].msgs;
   console.log(JSON.stringify(msgs));
   res.send(msgs);
   }
   else{
     res.send("");
   }
},(err,req,res,next)=>{
  res.status(400).send({error:err.message});
});

module.exports = router;