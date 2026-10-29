
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Student = require("./server/models/Student");
const Food = require("./server/models/Food");

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas bằng biến môi trường
mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: "236167_LeThiMinhThu"
    })
    .then(() => console.log("MongoDB Atlas connected successfully"))
    .catch((error) =>
        console.error("MongoDB connection error:", error.message)
    );

// Hàm kiểm tra ID MongoDB
function isValidId(id) {
    return mongoose.isValidObjectId(id);
}

// Hàm kiểm tra dữ liệu món ăn
function validateFood(data, isUpdate = false) {
    const requiredFields = [
        "foodId",
        "name",
        "category",
        "cuisine",
        "price",
        "quantity"
    ];

    if (!isUpdate) {
        for (const field of requiredFields) {
            if (
                data[field] === undefined ||
                data[field] === null ||
                data[field] === ""
            ) {
                return `Trường ${field} là bắt buộc`;
            }
        }
    }

    for (const field of ["foodId", "name", "category", "cuisine"]) {
        if (
            data[field] !== undefined &&
            (typeof data[field] !== "string" ||
                data[field].trim() === "")
        ) {
            return `Trường ${field} phải là chuỗi không được để trống`;
        }
    }

    for (const field of ["price", "quantity"]) {
        if (
            data[field] !== undefined &&
            (!Number.isFinite(data[field]) || data[field] < 0)
        ) {
            return `Trường ${field} phải là số không âm`;
        }
    }

    if (
        data.ingredients !== undefined &&
        (!Array.isArray(data.ingredients) ||
            !data.ingredients.every(
                (item) => typeof item === "string"
            ))
    ) {
        return "ingredients phải là một mảng chuỗi";
    }

    if (
        data.description !== undefined &&
        typeof data.description !== "string"
    ) {
        return "description phải là chuỗi";
    }

    if (
        data.imageUrl !== undefined &&
        typeof data.imageUrl !== "string"
    ) {
        return "imageUrl phải là chuỗi";
    }

    return null;
}

// Hàm xử lý lỗi MongoDB
function handleFoodError(res, error) {
    if (error.code === 11000) {
        return res.status(409).json({
            message: "Mã foodId đã tồn tại"
        });
    }

    if (error.name === "ValidationError" ||
        error.name === "CastError") {
        return res.status(400).json({
            message: "Dữ liệu không hợp lệ",
            error: error.message
        });
    }

    console.error(error);
    return res.status(500).json({
        message: "Lỗi máy chủ hoặc cơ sở dữ liệu"
    });
}

// Trang chủ
app.get("/", (req, res) => {
    res.json({ message: "Food Management Backend is running!" });
});

// Kiểm tra trạng thái backend và MongoDB
app.get("/health", (req, res) => {
    const connected = mongoose.connection.readyState === 1;

    res.status(connected ? 200 : 503).json({
        status: connected ? "ok" : "error",
        server: "running",
        database: connected ? "connected" : "disconnected"
    });
});

// API kiểm tra cũ
app.get("/api/hello", (req, res) => {
    res.json({ message: "Food Management Backend is running!" });
});

// ==================== API SINH VIÊN CŨ ====================

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
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
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

app.delete("/api/students/:id", async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({ message: "Xóa sinh viên thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== API MÓN ĂN ====================

// GET danh sách và tìm kiếm món ăn
// Ví dụ: /api/foods?search=pho
app.get("/api/foods", async (req, res) => {
    try {
        const search = (req.query.search || "").trim();
        let filter = {};

        if (search) {
            const keyword = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(keyword, "i");

            filter = {
                $or: [
                    { name: regex },
                    { category: regex },
                    { cuisine: regex }
                ]
            };
        }

        const foods = await Food.find(filter);
        res.status(200).json(foods);
    } catch (error) {
        handleFoodError(res, error);
    }
});

// GET chi tiết món ăn
app.get("/api/foods/:id", async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "ID món ăn không hợp lệ" });
        }

        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }

        res.status(200).json(food);
    } catch (error) {
        handleFoodError(res, error);
    }
});

// POST thêm món ăn
app.post("/api/foods", async (req, res) => {
    try {
        const validationError = validateFood(req.body);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const food = await Food.create(req.body);
        res.status(201).json(food);
    } catch (error) {
        handleFoodError(res, error);
    }
});

// PUT cập nhật món ăn
app.put("/api/foods/:id", async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "ID món ăn không hợp lệ" });
        }

        const validationError = validateFood(req.body, true);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Không cho cập nhật các trường nội bộ của MongoDB
        const allowedFields = [
            "foodId",
            "name",
            "category",
            "cuisine",
            "ingredients",
            "price",
            "quantity",
            "description",
            "imageUrl"
        ];

        const updateData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        const food = await Food.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!food) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }

        res.status(200).json(food);
    } catch (error) {
        handleFoodError(res, error);
    }
});

// DELETE xóa món ăn
app.delete("/api/foods/:id", async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "ID món ăn không hợp lệ" });
        }

        const food = await Food.findByIdAndDelete(req.params.id);

        if (!food) {
            return res.status(404).json({ message: "Không tìm thấy món ăn" });
        }

        res.status(200).json({ message: "Xóa món ăn thành công" });
    } catch (error) {
        handleFoodError(res, error);
    }
});

// Middleware xử lý JSON sai định dạng
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({ message: "JSON đầu vào không hợp lệ" });
    }

    next(error);
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
