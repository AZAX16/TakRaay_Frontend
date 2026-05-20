export type Board = {
  id: number;
  title: string;
  description: string;
  color: string;
};

export type CreateBoardPayload = {
  title: string;
  description?: string;
  color?: string;
};