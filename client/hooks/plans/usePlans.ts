import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAll, create } from '../../services/plan.service';
import { QueryKey } from '../../constants/queries';

export const usePlans = () => {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: [QueryKey.PLANS], queryFn: getAll });

  const createPlan = useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QueryKey.PLANS] });
    },
  });

  return { query, createPlan };
};
