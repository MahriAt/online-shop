const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static("uploads"));
app.use("/products", require("./routes/productRoute"));
app.use("/categories", require("./routes/categoryRoute"));
app.use("/users", require("./routes/userRoute"));
app.use("/orders", require("./routes/orderRoute"));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
