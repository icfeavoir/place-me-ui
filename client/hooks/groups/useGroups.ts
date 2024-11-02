import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAll, create, getByEventPlanId } from '../../services/group.service';
import { QueryKey } from '../../constants/queries';

type Props = {
  eventPlanId?: number;
};

export const useGroups = (props: Props) => {
  const { eventPlanId } = props;

  const query = useQuery({
    queryKey: [QueryKey.GROUPS, eventPlanId],
    queryFn: eventPlanId ? () => getByEventPlanId(eventPlanId) : getAll,
    staleTime: 10000,
  });

  const queryClient = useQueryClient();
  const createGroupMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QueryKey.GROUPS] });
    },
  });

  return { data: query.data ?? [], createGroupMutation };
};
