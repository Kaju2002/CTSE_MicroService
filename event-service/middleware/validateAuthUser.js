import { validateUser } from "../utils/userServiceClient.js";

/** Any valid JWT (USER or ADMIN). Used for seat updates from booking-service flows. */
export async function validateAuthUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const validation = await validateUser(token);

  if (!validation.valid) {
    return res.status(401).json({ message: "User not valid" });
  }

  req.user = validation.user;
  next();
}
