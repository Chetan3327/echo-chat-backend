import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    pic: {
        type: String,
        required: true,
        default: "https://avatar.iran.liara.run/public/boy?username=Ash"
    }
},
{
    timestamps: true
})

const UserModel = mongoose.model("User", UserSchema)
export default UserModel