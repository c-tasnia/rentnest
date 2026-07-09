import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as adminService from "../services/admin.service";

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await adminService.listAllUsers();
  sendSuccess(res, 200, "Users fetched", users);
});

export const updateUserStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!["ACTIVE", "BANNED"].includes(status)) {
    throw ApiError.badRequest("status must be ACTIVE or BANNED");
  }
  const user = await adminService.updateUserStatus(req.params.id, status);
  sendSuccess(res, 200, "User status updated", user);
});

export const getAllProperties = catchAsync(async (req, res) => {
  const properties = await adminService.listAllProperties();
  sendSuccess(res, 200, "Properties fetched", properties);
});

export const getAllRentalRequests = catchAsync(async (req, res) => {
  const requests = await adminService.listAllRentalRequests();
  sendSuccess(res, 200, "Rental requests fetched", requests);
});

export const createCategory = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  if (!name) throw ApiError.badRequest("Category name is required");
  const category = await adminService.createCategory(name, description);
  sendSuccess(res, 201, "Category created", category);
});

export const deleteCategory = catchAsync(async (req, res) => {
  await adminService.deleteCategory(req.params.id);
  sendSuccess(res, 200, "Category deleted");
});
