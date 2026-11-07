import mongoose from "mongoose";


const dbConnect = async()=>{
        try {
            await mongoose.connect(process.env.DBURL)
            console.log("db success")
            
        } catch (err) {
                    console.log(err)

            
        }

    
   

}

export default dbConnect;