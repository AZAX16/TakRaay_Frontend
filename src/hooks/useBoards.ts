import { useEffect, useState } from "react";
import type { Board, CreateBoardPayload } from "../utils/boardTypes";
import {
  createBoard,
  deleteBoard,
  getBoards,
} from "../services/boardsService";

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBoards = async () => {
      try {
        const boardsData = await getBoards();

        if (isMounted) {
          setBoards(boardsData);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("مشکلی در دریافت بردها پیش آمد.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBoards();

    return () => {
      isMounted = false;
    };
  }, []);

  const addBoard = async (payload: CreateBoardPayload) => {
    const newBoard = await createBoard(payload);

    setBoards((prevBoards) => [...prevBoards, newBoard]);

    return newBoard;
  };
  const removeBoard = async (boardId: Board["id"]) => {
    await deleteBoard(boardId);

    setBoards((prevBoards) =>
      prevBoards.filter((board) => board.id !== boardId),
    );
  };

  const refetchBoards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const boardsData = await getBoards();

      setBoards(boardsData);
    } catch {
      setError("مشکلی در دریافت بردها پیش آمد.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    boards,
    isLoading,
    error,
    addBoard,
    removeBoard,
    refetchBoards,
  };
};