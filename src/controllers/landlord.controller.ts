import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as propertyService from "../services/property.service";
import * as rentalService from "../services/rental.service";

export const createProperty = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const property = await propertyService.createProperty(req.user.id, req.body);
  sendSuccess(res, 201, "Property created", property);
});

export const updateProperty = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const property = await propertyService.updateProperty(req.params.id, req.user.id, req.body);
  sendSuccess(res, 200, "Property updated", property);
});

export const deleteProperty = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  await propertyService.deleteProperty(req.params.id, req.user.id);
  sendSuccess(res, 200, "Property deleted");
});

export const getMyProperties = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const properties = await propertyService.listLandlordProperties(req.user.id);
  sendSuccess(res, 200, "Landlord properties fetched", properties);
});

export const getRequestsForMyProperties = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const requests = await rentalService.listRequestsForLandlord(req.user.id);
  sendSuccess(res, 200, "Rental requests fetched", requests);
});

export const updateRequestStatus = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const request = await rentalService.updateRentalStatus(
    req.params.id,
    req.user.id,
    req.body.status
  );
  sendSuccess(res, 200, `Rental request ${req.body.status.toLowerCase()}`, request);
});
