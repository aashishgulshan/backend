import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access token and refresh token."
    );
  }
};
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
    4.) Check for Image, Check for avatar [Done]
    5.) Upload them to cloudinary, avatar [Done]
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

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, " avatar file is required ");
  }
  // if cover image is required then
  // if (!coverImageLocalPath) {
  //   throw new ApiError(400, " Cover file is required ");
  // }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
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

  res.status(200).json({
    message: "data Recieved !!",
    email,
  });
});

// -------------------------------------------- Login User ---------------------------------

/*
Tasks:-
    1.) Get Data from login route and req.body
    2.) DB Call using email or username
    3.) if found Validate with password
    4.) access token an rrefresh token
    5.) send in secure cookie to user

*/

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username or email required ! ");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Password !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const logedInUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedInUser,
          accessToken,
          refreshToken,
        },
        " User Successfully LogedIN!!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

export { registerUser, loginUser, logoutUser };