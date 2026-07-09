import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as rentalService from "../services/rental.service";

export const createRentalRequest = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const request = await rentalService.createRentalRequest(req.user.id, req.body);
  sendSuccess(res, 201, "Rental request submitted", request);
});

export const getMyRentalRequests = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const requests = await rentalService.listRequestsForTenant(req.user.id);
  sendSuccess(res, 200, "Rental requests fetched", requests);
});

export const getRentalRequestById = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const request = await rentalService.getRentalRequestById(
    req.params.id,
    req.user.id,
    req.user.role
  );
  sendSuccess(res, 200, "Rental request fetched", request);
});
