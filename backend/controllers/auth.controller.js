import User from "../models/user.model";
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    try {
        const {fullName, username, email, password} = req.body;

        const emailRegex = /^[^ \s@] +@[ ^\ s@] +\ . [^\ s@] +$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format"});
        }

        const existingUser = await User.findOne({ usernme });
        if(existingUser) {
            return res.status(400).json({ error: "Username is already taken"});
        }

        const existingEmail = await User.findOne({ usernme });
        if(existingUser) {
            return res.status(400).json({ error: "Email is already taken"});
        }

        //hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword            
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();
        } else {

        }

    } catch (error) {

    }
};

export const login = async (req, res) => {
    res.json({
        data: "You hit the login endpoint"
    });
};

export const logout = async (req, res) => {
    res.json({
        data: "You hit the logout endpoint"
    });
};