require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Student = require("./server/models/Student");
const Food = require("./server/models/Food");

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    dbName: "236167_LeThiMinhThu"
})
.then(() => console.log("MongoDB Atlas connected successfully"))
.catch(error => console.error("MongoDB connection error:", error.message));

// Trang chủ
app.get("/", (req, res) => {
    res.send("Food Management Backend is running!");
});

// Kiểm tra backend
app.get("/api/hello", (req, res) => {
    res.json({ message: "Food Management Backend is running!" });
});

// API sinh viên - giữ lại bài cũ
app.get("/api/students", async (req, res) => {
    try {
        res.json(await Student.find());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        res.status(201).json(await Student.create(req.body));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!student) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }
        res.json({ message: "Xóa sinh viên thành công" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API món ăn - GET danh sách
app.get("/api/foods", async (req, res) => {
    try {
        res.json(await Food.find());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET chi tiết món ăn
app.get("/api/foods/:id", async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }
        res.json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST thêm món ăn
app.post("/api/foods", async (req, res) => {
    try {
        res.status(201).json(await Food.create(req.body));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT cập nhật món ăn
app.put("/api/foods/:id", async (req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!food) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }
        res.json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE món ăn
app.delete("/api/foods/:id", async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }
        res.json({ message: "Xóa món ăn thành công" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
