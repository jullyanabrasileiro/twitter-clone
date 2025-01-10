import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message: "User not found"});

        if(!text && !img) {
            return res.status(400).json({message: "Post must have text or image"});
        }

        if(img) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(img);
                img = uploadResponse.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ error: "Failed to upload image" });
            }
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error.message);
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json( {error: "Post not found"} )
        }

        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json( {error: "You are not authorized to delete this post"});
        }

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error.message);
    }
}