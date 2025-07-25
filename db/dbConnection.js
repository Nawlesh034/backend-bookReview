import mongoose from 'mongoose'
const connection = async()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        if(connectionInstance){
            console.log("Connected to DB")
        }
    }
    catch(error){
        console.log("Error while connecting to DB",error)
    }
}



export default connection