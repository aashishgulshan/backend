import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
// ---------------------------Basic Connection Checkup------------------------------
// const registerUser = asyncHandler(async (req, res) => {
//   res.status(200).json({
//     message: "User Registered ! ",
//   });
// });

// -----------------------------------------------------------------------------------

/* 
    1.) Get user Details from frontend =[Done]
    2.) validate not empty [Done]
    3.) Check if user already exists: username, email [Done]
    4.) Check for Image, Check for Avtar [Done]
    5.) Upload them to cloudinary, Avtar [Done]
    6.) Create user Object - creat entry in database [Done]
    7.) remove password and refresh token from response [Done]
    8.) Check for user creation [Done]
    9.) return response. [Done]
*/

// ---------------------------- Get user Details from frontend -------------------------

const registerUser = asyncHandler(async (req, res) => {
  // ---Get user Details from frontend---
  const { userName, email, fullName, password } = req.body;

  // ------------------------------ Method 1 to validate the fiels --------------
  //   if (fullName === "") {
  //     throw new ApiError(400, "Full name is required !")
  //   }

  // ------------------------------ Method 2 to validate the fiels --------------

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All feilds Required !!");
  }

  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already register");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, " Avtar file is required ");
  }
  // if cover image is required then
  // if (!coverImageLocalPath) {
  //   throw new ApiError(400, " Cover file is required ");
  // }
  const avtar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avtar) {
    throw new ApiError(400, "Avtar file is required");
  }

  const user = await User.create({
    fullName,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser) {
    throw new ApiError (500, " Something went wrong while registration of the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, " user registered succesfully")
  )

  //   console.log("Full Name:- ", fullName);
  //   console.log("User Name:- ", userName);
  //   console.log("Email:- ", email);

  res.status(200).json({
    message: "data Recieved !!",
    email,
  });
});

export { registerUser };
