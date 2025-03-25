export const getAuthHeaders = () => {
  try {
    const storedData = localStorage.getItem("cap-auth-storage");
    const authToken = storedData
      ? JSON.parse(storedData)?.state?.authToken
      : null;

    return {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  } catch (error) {
    console.error("Error parsing auth token:", error);
    return { "Content-Type": "application/json" }; // Fallback headers
  }
};
