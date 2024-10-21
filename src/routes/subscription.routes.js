import { Router } from "express";
import {
  toggleSubscription,
  getSubscriberChanels,
  getChannelSubscribers,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/toggleSubscription").post(toggleSubscription);
router.route("/getSubscriberChanels").post(getSubscriberChanels);
router.route("/getChannelSubscribers").post(getChannelSubscribers);

export default router;
