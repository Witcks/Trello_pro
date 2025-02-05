import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
// import { mockData } from '~/apis/mock-data';
import { useEffect, useState } from 'react';
import {
  fetchBoardDetailsAPI,
  creatNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateDetailColumnAPI,
  moveCardToDifferentColumnAPI,
  deleteDetailColumnAPI,
} from '~/apis/index';
import { generatePlacehoderCard } from '~/utils/formatters';
import { isEmpty } from 'lodash';
import { mapOrder } from '~/utils/sorts';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';


const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = '679a57f464f89c950769733e';
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlacehoderCard(column)];
          column.cardOrderIds = [generatePlacehoderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      });
      setBoard(board)
    });
  }, []);

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await creatNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    })

    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    createdColumn.cards = [generatePlacehoderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlacehoderCard(createdColumn)._id];
    setBoard(newBoard);
  }

  const createNewCard = async (newCardData) => {
    if (!board) return;

    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    })

    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId);

    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_Placedholder)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }

    }
    setBoard(newBoard);
  }

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((column) => column._id);

    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);

    updateBoardDetailsAPI(board._id, {
      columnOrderIds: dndOrderedColumnIds,
    });
  }

  const moveCardIntheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId);
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);

    updateDetailColumnAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((column) => column._id);

    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);

    let prevCardOderIds = dndOrderedColumns.find((column) => column._id === prevColumnId).cardOrderIds;
    if (prevCardOderIds[0].includes('placeholder-card')) prevCardOderIds = [];

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOderIds: prevCardOderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((column) => column._id === nextColumnId)?.cardOrderIds,
    });
  }

  const deleteColumnDetail = (columnId) => {
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter((column) => column._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter((columnId) => columnId !== columnId);
    setBoard(newBoard);

    deleteDetailColumnAPI(columnId).then((res) => {
      toast.success(res?.deleteResult);
    });

  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', gap: 2 }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardIntheSameColumn={moveCardIntheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetail={deleteColumnDetail}
      />
    </Container>
  );
};

export default Board;
