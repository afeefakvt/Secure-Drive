import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    
}

const userSchema = new Schema<IUser>(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique: true,
            lowercase: true,
        },
        password:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)
export const User = mongoose.model<IUser>('User',userSchema)