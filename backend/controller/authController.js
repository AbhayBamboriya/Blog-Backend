import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const cookieOptions={
    maxAge:7*24*60*60*1000,
    httpOnly:true, 
    secure:true ,
    sameSite:'None'
}


export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    console.log(
      'in login'
    );
    
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie('token',token,cookieOptions)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const logout = async (req, res) => {
  console.log('asjwej');
  
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.clearCookie("token", cookieOptions);

    res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Logout failed" });
  }
};
