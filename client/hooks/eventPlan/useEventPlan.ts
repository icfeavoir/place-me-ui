import { QueryKey } from '@/constants/queries';
import { getByEventIdPlanId } from '@/services/eventPlan.service';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type Props = {
  eventId?: number;
  planId?: number;
};

export const useEventPlan = (props: Props) => {
  const { eventId, planId } = props;

  const query = useQuery({
    queryKey: [QueryKey.EVENTS, eventId, planId],
    queryFn: () => {
      if (!eventId || !planId) return null;
      return getByEventIdPlanId(eventId, planId);
    },
    staleTime: 10000,
  });

  const eventPlanId = query.data?.id;

  return { query, eventPlanId };
};
