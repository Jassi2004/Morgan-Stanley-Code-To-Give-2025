import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js"

const getNotification = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }); 
  // console.log(notifications)
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notifications },
        "Notifications fetched successfully"
      )
    );
});

const sendNotification = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Notification message is required");
  }

  const notification = await Notification.create({ message });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { notification }, "Notification sent successfully")
    );
});

export {getNotification, sendNotification};