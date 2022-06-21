import { Models } from "../../core";

// import TargetCamelCase from "../entities/TargetCamelCaseEntity";

interface MainContent {
  id?: number;
  name?: string;
}

// -------------------------------------------------------- //

// Create
export const inputTargetCamelCase = (data: MainContent) => {
  // return Models.InputFromGetId(TargetCamelCase, data)
};

// Read
export const showAllTargetCamelCase = () => {
  // return Models.SelectFrom(TargetCamelCase, {});
};

// Update
export const updateFromTargetCamelCaseWhereId = (
  where: MainContent,
  new_data: MainContent
) => {
  // return Models.UpdateFrom(TargetCamelCase, where, new_data);
};

// Change
export const changeFromTargetCamelCaseWhereId = (
  where: MainContent,
  new_data: MainContent
) => {
  // return Models.UpdateFrom(TargetCamelCase, where, new_data);
};

// Delete
export const deleteFromTargetCamelCaseWhereId = (where: MainContent) => {
  // return Models.DeleteFrom(TargetCamelCase, where);
};
