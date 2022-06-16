import { Services } from "../core";

// -------------------------------------------------------- //

// Create
export const addExample = async () => {
  try {
    return Services.Response.Success("berhasil ditambahkan");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Read
export const getExample = async () => {
  try {
    return Services.Response.Success({ list: [] });
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Update
export const editExample = async () => {
  try {
    return Services.Response.Success("berhasil diupdate");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Change
export const updateSpecificExample = async () => {
  try {
    return Services.Response.Success("berhasil diupdate beberapa");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};

// Delete
export const removeExample = async () => {
  try {
    return Services.Response.Success("berhasil dihapus");
  } catch (error) {
    return Services.Response.Error.Server(error);
  }
};
