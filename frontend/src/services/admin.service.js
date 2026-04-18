import apiClient from "./apiClient";
import { extractApiErrorMessage, unwrapApiData } from "../utils/http";

export const adminService = {
  async getSubjects() {
    try {
      const response = await apiClient.get("/admin/subjects");
      return unwrapApiData(response) || [];
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async createSubject(payload) {
    try {
      await apiClient.post("/admin/subjects", payload);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async getClasses() {
    try {
      const response = await apiClient.get("/admin/classes");
      return unwrapApiData(response) || [];
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async createClass(payload) {
    try {
      await apiClient.post("/admin/classes", payload);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async getTeachers() {
    try {
      const response = await apiClient.get("/admin/teachers");
      return unwrapApiData(response) || [];
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async createTeacher(payload) {
    try {
      await apiClient.post("/admin/teachers", payload);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async getTeachingAssignments() {
    try {
      const response = await apiClient.get("/admin/teaching-assignments");
      return unwrapApiData(response) || [];
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  async createTeachingAssignment(payload) {
    try {
      await apiClient.post("/admin/teaching-assignments", payload);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
};
