import mongoose from 'mongoose';


 const connectDB = async () => {
    try {

        const conn = await mongoose.connect("mongodb+srv://tkaswin0911:2xf8GiDhpfduc9Ex@cluster0.wy1h40f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("connected to mongoDB" + " " + conn.connection.host);
        

    } catch (error) {
        console.log('error in mongodb' + error);
        
    }
 }


 export default connectDB;