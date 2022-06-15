import { Models } from "jumpboot";

// import TargetCamelCase from "../entities/TargetCamelCaseEntity";

interface MainContent {
  id?: number;
  name?: string;
}

// -------------------------------------------------------- //

// Create
export const inputTargetCamelCase = async (data: MainContent) => {
  // return Models.InputFromGetId(TargetCamelCase, data)
};

// Read
export const showAllTargetCamelCase = async () => {
  // return Models.SelectFrom(TargetCamelCase, {});
};

// Update
export const updateFromTargetCamelCaseWhereId = async (
  where: MainContent,
  new_data: MainContent
) => {
  // return Models.UpdateFrom(TargetCamelCase, where, new_data);
};

// Change
export const changeFromTargetCamelCaseWhereId = async (
  where: MainContent,
  new_data: MainContent
) => {
  // return Models.UpdateFrom(TargetCamelCase, where, new_data);
};

// Delete
export const deleteFromTargetCamelCaseWhereId = async (where: MainContent) => {
  // return Models.DeleteFrom(TargetCamelCase, where);
};
