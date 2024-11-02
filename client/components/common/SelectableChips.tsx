import { Chip } from '@mui/material';

type Item = {
  id: string | number;
  text: string | number;
};

type Props = {
  items: Item[];
  selectedId?: string | number;
  onClick?: (id: string | number) => void;
};

export const SelectableChips = (props: Props) => {
  const { items, selectedId, onClick } = props;

  return (
    <>
      {items.map(({ id, text }) => {
        const isSelected = id === selectedId;
        return (
          <Chip
            key={`chip-${id}`}
            clickable
            color={isSelected ? 'primary' : 'default'}
            variant={isSelected ? 'filled' : 'outlined'}
            onClick={() => onClick?.(id)}
            label={text}
          />
        );
      })}
    </>
  );
};
