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
    username:{
      required:true,
      type:String,
      trim:true
    },
    phoneno:{
      type:String,
      default:10,
      required:true,
      min:0,
      validate(value){
        if(!validator.isMobilePhone(value))
        throw "phone number is valid";
      }

    } ,
  email:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value))
      throw "email is not valid";
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

  var isFound ;
  isFound = await User.findOne({email:user.email});
  if(isFound){
    console.log('insise email found' ,isFound);
    throw new Error("email is already taken,use different");
  
  }

  isFound = await User.findOne({phoneno:user.phoneno});
  if(isFound){
   throw new Error("phone no. is already registered,use different");
  }
  isFound = await User.findOne({username:user.username})
  if(isFound){
    throw new Error("username is already taken,choose different");
  }
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
