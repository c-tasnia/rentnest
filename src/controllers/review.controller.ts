import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as reviewService from "../services/review.service";

export const createReview = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const review = await reviewService.createReview(req.user.id, req.body);
  sendSuccess(res, 201, "Review submitted", review);
});
