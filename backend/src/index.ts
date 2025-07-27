import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
// import userRoutes from './routes/userRoutes';



const app = express();

connectDB();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// app.use('/api',userRoutes);

const port = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("hello")
});

app.listen(port,()=>{
    console.log((`Server is running on ${port}`));
    
});