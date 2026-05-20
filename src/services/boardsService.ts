import apiClient from "./api";
import type { Board, CreateBoardPayload } from "../utils/boardTypes";

type ProjectApiResponse = {
  id: number;
  name: string;
  description: string;
  owner: number;
  created_at: string;
  updated_at: string;
};

type CreateProjectRequest = {
  name: string;
  description: string;
};

const boardColors = ["#C7F0F4", "#F5C9C9", "#55B3BF", "#F6E0B5"];

const getBoardColor = (id: number) => {
  return boardColors[id % boardColors.length];
};

const mapProjectToBoard = (
  project: ProjectApiResponse,
  fallbackColor?: string,
): Board => {
  return {
    id: project.id,
    title: project.name,
    description: project.description || "توضیحاتی برای این برد ثبت نشده است.",
    color: fallbackColor || getBoardColor(project.id),
  };
};

export const getBoards = async (): Promise<Board[]> => {
  const response = await apiClient.get<ProjectApiResponse[]>("/projects/");

  return response.data.map((project) => mapProjectToBoard(project));
};

export const createBoard = async (
  payload: CreateBoardPayload,
): Promise<Board> => {
  const requestBody: CreateProjectRequest = {
    name: payload.title,
    description: payload.description || "",
  };

  const response = await apiClient.post<ProjectApiResponse>(
    "/projects/",
    requestBody,
  );

  return mapProjectToBoard(response.data, payload.color);
};

export const deleteBoard = async (boardId: Board["id"]): Promise<void> => {
  await apiClient.delete(`/projects/${boardId}/`);
};