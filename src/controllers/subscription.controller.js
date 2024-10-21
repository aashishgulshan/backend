import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {Subscription} from "../models/subscription.models.js"
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) =>{
    const {chanelId} = req.params
})

const getChannelSubscribers = asyncHandler(async (req, res) => {
    const {chanelId} = req.params
}) 

const getSubscriberChanels = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params
})
export{toggleSubscription, getChannelSubscribers, getSubscriberChanels}