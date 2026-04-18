import apiClient from "./apiClient";
import { extractApiErrorMessage, unwrapApiData } from "../utils/http";

const getWithFallback = async (urls) => {
  let lastError = null;

  for (const url of urls) {
    try {
      const response = await apiClient.get(url);
      return unwrapApiData(response) || [];
    } catch (error) {
      lastError = error;

      const status = error?.response?.status;
      if (status && status !== 404) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Endpoint not available");
};

export const teacherService = {
  async getAssignments() {
    try {
      return await getWithFallback([
        "/teacher/assignments",
        "/teacher/teaching-assignments",
      ]);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async getStudentsByAssignment({ assignmentId, classId }) {
    const candidateUrls = [];

    if (assignmentId) {
      candidateUrls.push(`/teacher/assignments/${assignmentId}/students`);
    }

    if (classId) {
      candidateUrls.push(`/teacher/classes/${classId}/students`);
      candidateUrls.push(`/teacher/students?classId=${classId}`);
    }

    try {
      return await getWithFallback(candidateUrls);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async markAttendance(payload) {
    try {
      await apiClient.post("/teacher/attendance/mark", payload);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
};
