/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Column from './Column/Column';
import Button from '@mui/material/Button';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { toast } from 'react-toastify';


const ListColumn = ({ columns, createNewColumn, createNewCard, deleteColumnDetail }) => {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState('');

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Column title is required');
      return;
    }

    const newColumnData = {
      title: newColumnTitle,
    }

    createNewColumn(newColumnData);

    toggleNewColumnForm();
    setNewColumnTitle('');
  }

  return (
    <SortableContext
      items={columns?.map((item) => item._id)}
      strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 },
        }}>
        {columns?.map((column) => (
          <Column
            key={column._id}
            column={column}
            createNewCard={createNewCard}
            deleteColumnDetail={deleteColumnDetail}
          />
        ))}
        {/* Add new column button */}
        {!openNewColumnForm ?
          <Box onClick={toggleNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
            }}>
            <Button
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pt: 2.5,
                py: 1,
              }}
              startIcon={<NoteAddIcon />}>
              Add new column
            </Button>
          </Box>
          :
          <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
            <TextField
              label="Enter column title"
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button onClick={addNewColumn} variant='contained' color='success' size='small' sx={{
                boxShadow: 'none',
                border: '0.5px solid',
                borderColor: (theme) => theme.palette.success.main,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.success.main,
                }
              }}>
                Add column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color:'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light },
                }}
                onClick={toggleNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  );
};

export default ListColumn;
