import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

type Props = {
  id: string;
};

export const Seat = ({ id }: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable' });

  return (
    <Box
      id={id}
      style={{ opacity: 1 }}
      ref={setNodeRef}
      bgcolor={isOver ? 'rgba(0,0,0,0.3)' : 'white'}
    >
      {id}
    </Box>
  );
};
