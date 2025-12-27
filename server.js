require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use(require("./routes/donor.routes"));
app.use(require("./routes/recipient.routes"));
app.use(require("./routes/request.routes"));

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
