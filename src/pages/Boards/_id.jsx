import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
// import { mockData } from '~/apis/mock-data';
import { useEffect, useState } from 'react';
import { fetchBoardDetailsAPI } from '~/apis/index';

const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = '6712099aec71262b87e858a9';
    fetchBoardDetailsAPI(boardId).then((board) => setBoard(board));
  }, []);

  console.log('board:', board);

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
};

export default Board;
