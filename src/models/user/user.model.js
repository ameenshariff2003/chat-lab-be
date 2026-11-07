import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username is already used"],

    },
    email: {
        type: String,
        unique: [true, "email is already used"],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: true,
        select:false

    },
    verified: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    })

    userSchema.pre('save',async function () {
        if(!this.isModified('password')) 
            return 
        this.password = await bcrypt.hash(this.password,10);
    })

    userSchema.methods.comparePassword = async function(givenPassword){
        return await bcrypt.compare(givenPassword,this.password)

    }

const User = mongoose.model("User", userSchema)

export default User;

