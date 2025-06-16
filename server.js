import express from 'express'
const app = express();
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from './config/db.js';  
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import offerproductsRoute from './routes/offerproductsRoute.js'
import cartRoutes from './routes/cartRoutes.js';
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from './routes/wishlistRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js'
import contactRoutes from './routes/contactRoutes.js';



dotenv.config() ;



// //databse configuring
connectDB();


// //middleware
//{ origin: "http://localhost:5173", credentials: true }
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use("/api/v1/auth", authRoutes );
app.use("/api/v1/Category", categoryRoutes );
app.use("/api/v1/product", productRoutes )
app.use("/api/v1/user", authRoutes);
app.use("/api/offer-products", offerproductsRoute);
app.use('/api/v1/cart', cartRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use("/api/orders", adminOrderRoutes);
app.use('/api/contact', contactRoutes);



//rest api

app.get('/' , (req , res)=>{
    console.log("GET / route hit");
    res.send("welcome ")
});


const PORT = process.env.PORT || 5050 ;


app.listen(PORT , ()=> {
    console.log(`server running on ${PORT}`)
    
})