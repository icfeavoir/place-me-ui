import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAll, create } from '../../services/event.service';
import { QueryKey } from '../../constants/queries';

export const useEvents = () => {
  const query = useQuery({ queryKey: [QueryKey.EVENTS], queryFn: getAll });

  const queryClient = useQueryClient();
  const createEvent = useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QueryKey.EVENTS] });
    },
  });

  return { query, createEvent };
};
