import axios from "axios";

export async function validateUser(token) {
  const userServiceUrl = process.env.USER_URL || "http://user-service:4003";
  try {
    const response = await axios.get(`${userServiceUrl}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(
      "✓ User service response:",
      JSON.stringify(response.data, null, 2),
    );
    console.log("✓ User email:", response.data?.user?.email);

    if (response.data && response.data.user && response.data.user.role) {
      const user = response.data.user;
      console.log("✓ Returning user with email:", user.email);
      return { valid: true, user };
    }
    console.warn("⚠️ No valid user role found in response");
    return { valid: false };
  } catch (error) {
    console.error("❌ User service validation error:", error.message);
    return { valid: false, error: error.message };
  }
}
