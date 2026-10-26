import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        // « Alice@Mail.fr » et « alice@mail.fr » désignent le même compte
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        // Jamais renvoyé par une requête, sauf demande explicite : .select("+password")
        select: false
    },
    username: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true })

userSchema.pre("save", async function() {
    if ( this.isModified("password") ) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

// Le hash ne sort jamais de l'API, même juste après un save()
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password
        return ret
    }
})

export default mongoose.model("User", userSchema)
