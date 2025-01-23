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

        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted successfully"})

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error.message);
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = { user: userId, text }

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error.message);
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error: "Post not found"})
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            //unlike post
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}});
            await Post.updateOne({_id:postId}, {$pull: {getLikedPosts: postId}});
            res.status(200).json({message: "Post unliked successfully"});
        } else {
            //like post
            post.likes.push(userId);
            await Post.updateOne({_id:postId}, {$push: { lLikedPosts: postId }});
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            });
            await notification.save();

            res.status(200).json({message: "Post unliked successfully"});
        }

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error.message);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ createAt: -1}).populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        })

        if(posts.length === 0 ) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in getAllPosts controller: ", error);
    }
}

export const getLikedPosts = async (req, res) => {
    try {

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in getAllPosts controller: ", error);
    }
}

export const getFollowingPosts = async (req, res) => {
    try {

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in getAllPosts controller: ", error);
    }
}