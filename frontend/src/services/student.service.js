import apiClient from "./apiClient";
import { extractApiErrorMessage, unwrapApiData } from "../utils/http";

export const studentService = {
  async getMyAttendance() {
    try {
      const response = await apiClient.get("/student/attendance/me");
      return unwrapApiData(response) || { summary: {}, records: [] };
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
};
