import { Models } from "../../core";

import Example from "../entities/ExampleEntity";

interface MainContent {
  id?: number;
  name?: string;
}

// -------------------------------------------------------- //

// Create
export const inputExample = async (data: MainContent) => {
  // return Models.InputFromGetId(Example, data)
};

// Read
export const showAllExample = async () => {
  // return Models.SelectFrom(Example, {});
};

// Update
export const updateFromExampleWhereId = async (
  where: MainContent,
  new_data: MainContent
) => {
  // return Models.UpdateFrom(Example, where, new_data);
};

// Change
export const changeFromExampleWhereId = async (
  where: MainContent,
  new_data: MainContent
) => {
  // return Models.UpdateFrom(Example, where, new_data);
};

// Delete
export const deleteFromExampleWhereId = async (where: MainContent) => {
  // return Models.DeleteFrom(Example, where);
};
