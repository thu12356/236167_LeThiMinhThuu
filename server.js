
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Đường dẫn đến model Student
const Student = require("./server/models/Student");

const app = express();

app.use(cors());
app.use(express.json());

// Kiểm tra kết nối MongoDB
async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("LỖI: Chưa cấu hình MONGODB_URI trong file .env");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Atlas connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
}

connectDB();

// Câu 36: GET danh sách sinh viên
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Câu 37: POST thêm sinh viên
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 38: PUT cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 39: DELETE sinh viên
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({ message: "Xóa sinh viên thành công" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API kiểm tra backend
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Backend!" });
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
