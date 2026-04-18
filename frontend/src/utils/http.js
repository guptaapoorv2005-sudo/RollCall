export const unwrapApiData = (response) => response?.data?.data ?? null;

export const extractApiMessage = (response) => response?.data?.message ?? "Success";

export const extractApiErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.userMessage) {
    return error.userMessage;
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
