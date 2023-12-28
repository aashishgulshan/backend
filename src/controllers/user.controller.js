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
  const { username, email, fullName, password } = req.body;

  // ------------------------------ Method 1 to validate the fiels --------------
  //   if (fullName === "") {
  //     throw new ApiError(400, "Full name is required !")
  //   }

  // ------------------------------ Method 2 to validate the fiels --------------

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All feilds Required !!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already register");
  }
  console.log(req.files);

  const avtarLocalPath = req.files?.avtar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  if (!avtarLocalPath) {
    throw new ApiError(400, " Avtar file is required ");
  }
  // if cover image is required then
  // if (!coverImageLocalPath) {
  //   throw new ApiError(400, " Cover file is required ");
  // }
  const avtar = await uploadOnCloudinary(avtarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avtar) {
    throw new ApiError(400, "avtar file is required");
  }

  const user = await User.create({
    fullName,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  console.log(user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      " Something went wrong while registration of the user"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, " user registered succesfully"));

  //   console.log("Full Name:- ", fullName);
  //   console.log("User Name:- ", username);
  //   console.log("Email:- ", email);

  res.status(200).json({
    message: "data Recieved !!",
    email,
  });
});

export { registerUser };



/*
ISSUE:=>
        [1]. When i try to upload avtar image then it works fine but whenever i try to uplopad avtar with cover image then it showing:-
        -------------------------------------------------
        [nodemon] starting `node -r dotenv/config --experimental-json-modules src/index.js`

 MongoDB Connected Sucessfully !! DB HOST: ac-k4fitwn-shard-00-01.cumxf6g.mongodb.net
 Server is running on port: 8000
[Object: null prototype] {
  avtar: [
    {
      fieldname: 'avtar',
      originalname: 'hsf.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/temp',
      filename: 'hsf.jpg',
      path: 'public\\temp\\hsf.jpg',
      size: 74030
    }
  ]
}
TypeError: Cannot read properties of undefined (reading '0')
    at file:///C:/Users/AashishGulshan/Desktop/New%20folder/backend/src/controllers/user.controller.js:56:52
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)


*/