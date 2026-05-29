import apiClient from "./api";
import type { Board, CreateBoardPayload } from "../utils/boardTypes";

type ProjectApiResponse = {
  id: number;
  name: string;
  description: string;
  owner: number;
  background_color?: string | null;
  created_at: string;
  updated_at: string;
};

type CreateProjectRequest = {
  name: string;
  description: string;
  background_color_input: string;
};

const DEFAULT_BOARD_COLOR = "#B8EAED";

const mapProjectToBoard = (
  project: ProjectApiResponse,
  fallbackColor = DEFAULT_BOARD_COLOR,
): Board => {
  return {
    id: project.id,
    title: project.name,
    description: project.description || "توضیحاتی برای این برد ثبت نشده است.",
    color: project.background_color || fallbackColor,
  };
};

export const getBoards = async (): Promise<Board[]> => {
  const response = await apiClient.get<ProjectApiResponse[]>("/projects/");

  return response.data
    .slice()
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map((project) => mapProjectToBoard(project));
};

export const createBoard = async (
  payload: CreateBoardPayload,
): Promise<Board> => {
  const selectedColor = payload.color || DEFAULT_BOARD_COLOR;

  const requestBody: CreateProjectRequest = {
    name: payload.title,
    description: payload.description || "",
    background_color_input: selectedColor,
  };

  const response = await apiClient.post<ProjectApiResponse>(
    "/projects/",
    requestBody,
  );

  return mapProjectToBoard(response.data, selectedColor);
};

export const deleteBoard = async (boardId: Board["id"]): Promise<void> => {
  await apiClient.delete(`/projects/${boardId}/`);
};