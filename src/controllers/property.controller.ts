import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/ApiResponse";
import * as propertyService from "../services/property.service";

export const getProperties = catchAsync(async (req, res) => {
  const result = await propertyService.listProperties(req.query as any);
  sendSuccess(res, 200, "Properties fetched", result.items, result.meta);
});

export const getPropertyById = catchAsync(async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.id);
  sendSuccess(res, 200, "Property fetched", property);
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await propertyService.listCategories();
  sendSuccess(res, 200, "Categories fetched", categories);
});
