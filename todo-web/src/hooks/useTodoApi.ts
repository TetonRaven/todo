import { useContext } from "react";
import { type TodoApi, TodoApiContext } from "../services/todoApi";

export function useTodoApi(): TodoApi {
  const apiService = useContext(TodoApiContext);

  if (!apiService) {
    throw new Error('TodoApi provider is not configured.');
  }

  return apiService;
}