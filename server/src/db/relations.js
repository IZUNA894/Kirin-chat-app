//var validator= require('validator');
var mongoose= require('mongoose');
//var bcrypt = require('bcryptjs');
//var jwt = require("jsonwebtoken");
//const Task = require("./task_module");

var userSchema  = new mongoose.Schema({
    uid: {
      required:true,
      type:String,
      trim:true,
    },
    // age:{
    //   type:Number,
    //   default:10,
    //   required:true,
    //   min:0,

    // } ,
  
  isFriendWith:[
    {
      uid:{
        required:true,
        type:String
      }
    }
  ]
  
},
{
  timestamps:true
} );

// userSchema.virtual("tasks",{
//   ref:'Task',
//   localField:"_id",
//   foreignField:"owner"
// });

userSchema.pre('save' , async function(next){
  var user = this;

  // var isFound = await User.findOne({email:user.email});
  // if(isFound){
  //   console.log(isFound);
  //   throw new Error("email is taken");
  //
  // }

  
  next();
});









var Realations = mongoose.model('Realations', userSchema);
module.exports = Realations;
