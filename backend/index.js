const express = require("express");

const app = express();
app.use(express.json());

app.use("/uploads", express.static("upload"));

app.use("/products", require("./routes/productRoute"));
app.use("/categories", require("./routes/categoryRoute"));
app.use("/users", require("./routes/userRoute"));
app.use("/orders", require("./routes/orderRoute"));

app.listen(3000, () => console.log("Server is running on port 300"));
