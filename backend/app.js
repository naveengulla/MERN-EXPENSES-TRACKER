const express= require("express");
const userRouter = require("./routes/userRouter");
const cors= require("cors");
const app= express();
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRoutere");

mongoose.connect("mongodb+srv://naveengulla545:U98dhL8BQ7AI23G8@naveen.b5k9og1.mongodb.net/mern-expenses")
.then(()=>console.log("DB Connection successful"))
.catch((e)=>console.log(e));
const corsOptions={
    origin:["http://localhost:5173"]
}
app.use(cors(corsOptions))
//! Middlewares
app.use(express.json())
//!Route
app.use('/',userRouter);
app.use('/',categoryRouter);
app.use('/',transactionRouter);
//!Error
app.use(errorHandler);


const port=process.env.PORT || 8000;
app.listen(port,()=>console.log(`Server is running on ${port}`));