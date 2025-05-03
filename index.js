import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.mongo_url)
.then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Create User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
});

const User = mongoose.model("User", userSchema);
// GET Route
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST Route
app.post("/users", async (req, res) => {
    const { name, email, age } = req.body;

    try {
        const newUser = new User({ name, email, age });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE Route
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, age },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE Route
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:${PORT}");
});