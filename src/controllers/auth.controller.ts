import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/ApiResponse";
import * as authService from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  sendSuccess(res, 201, "User registered successfully", result);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  sendSuccess(res, 200, "Login successful", result);
});

export const getMe = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await authService.getCurrentUser(req.user.id);
  sendSuccess(res, 200, "Current user fetched", user);
});
