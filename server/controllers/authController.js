const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // set true only on https
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function sign(user) {
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
   

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });
 const salt = await bcrypt.genSalt(10);
 const hashedPassword =await bcrypt.hash(password,salt);

user=await User.create({name,email,password:hashedPassword});



    res.cookie("token", sign(user), cookieOptions);
    res.status(201).json({user:{id:user._id,name:user.name,email:user.email}});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 exports.logout=(req,res)=>{
  res.clearCookie("token",cookieOptions);
  res.json({message:"Logged out successfully"});
 };
exports.me = async (req, res) => {
  try{
    const user = await User.findById(req.userId || req.user?.id).select("-password");
  res.json(user);
}catch(err){
  res.status(500).json({message:err.message});
}

};

