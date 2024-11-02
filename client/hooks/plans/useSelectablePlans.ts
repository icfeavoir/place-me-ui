import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAll, create } from '../../services/event.service';
import { QueryKey } from '../../constants/queries';
import { usePlans } from './usePlans';
import { useEffect, useState } from 'react';

export const useSelectablePlans = () => {
  const [selectedId, setSelectedId] = useState<number>();

  const { query, createPlan } = usePlans();

  const events = query.data ?? [];

  /**
   * Select the first event per default
   */
  useEffect(() => {
    if (events.length === 0) return;

    setSelectedId((curr) => curr ?? events[0].id);
  }, [events]);

  return { query, createPlan, selectedId, setSelectedId };
};
