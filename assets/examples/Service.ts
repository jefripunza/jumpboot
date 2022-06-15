import { Services } from "jumpboot";

// Repository
// import * as TargetCamelCase from "../models/repository/TargetCamelCaseRepository";

// -------------------------------------------------------- //

// Create
export const addTargetCamelCase = async () => {
  try {
    return Services.Response.Success("berhasil ditambahkan");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Read
export const getTargetCamelCase = async () => {
  try {
    return Services.Response.Success({ list: [] });
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Update
export const editTargetCamelCase = async () => {
  try {
    return Services.Response.Success("berhasil diupdate");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Change
export const updateSpecificTargetCamelCase = async () => {
  try {
    return Services.Response.Success("berhasil diupdate beberapa");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Delete
export const removeTargetCamelCase = async () => {
  try {
    return Services.Response.Success("berhasil dihapus");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};
