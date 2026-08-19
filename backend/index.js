const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.listen(3000, () => console.log("Server is running on port 3000"));
