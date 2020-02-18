var validator= require('validator');
var mongoose= require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
//const Task = require("./task_module");
var userSchema  = new mongoose.Schema({
    name: {
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
  email:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value))
      throw "error:is not email";
    }
  },
  password:{
    type:String,
    trim:true,
    minlength:8,
    required:true
  },
  imgSrc:{
    type:String,
    trim:true,
    default:null
  },
  tokens:[
    {
      token:{
        required:true,
        type:String
      }
    }
  ],
  avatar:{
    type:Buffer,
    default:null
  }
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

  var hashedPass ="";
  if(user.isModified('password'))
  {
   hashedPass =  await bcrypt.hash(user.password,8);
   //console.log(hashedPass);
   user.password =hashedPass;
  }
  next();
});




userSchema.methods.getAuthToken = async function(){
  var user = this;
  var token = await jwt.sign({_id:user._id.toString()},"secretkey");
  user.tokens= user.tokens.concat({token});
  await user.save();
  return token;

}

userSchema.methods.toJSON = function (){
  var user= this;
  user = user.toObject();
  // delete user.tokens;
  // delete user.password;
  // delete user.__v;
  // delete user.avatar;
  //console.log(user);
  return user;
}

userSchema.statics.findByCredentials = async (email,password) =>
{
  var user = await User.findOne({email});
  if(!user){
    // throw new Error("unable to login");
    return undefined;
  }

  var isFound = bcrypt.compare(password,user.password);
  //console.log("value of is found"+ JSON.stringify(isFound));
  if(!isFound){
    console.log("error thrrownnnnn");
    throw new Error("unable to login");
  }
  return user
}

var User = mongoose.model('Users', userSchema);
module.exports =User;