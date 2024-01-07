import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema ({
    subscriber:{
        type: Schema.Types.ObjectId, //Refers to User Consumer
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // refers to Content Provider
        ref: "User"
    }
},{timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)