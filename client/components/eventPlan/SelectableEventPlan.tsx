import Grid from '@mui/material/Grid2';
import { SelectableChips } from '../common/SelectableChips';
import { useSelectableEvents } from '@/hooks/events/useSelectableEvents';
import { useSelectablePlans } from '@/hooks/plans/useSelectablePlans';
import { useEventPlan } from '@/hooks/eventPlan/useEventPlan';
import { useEffect } from 'react';

type Props = {
  onSelectedEventChanged?: (id?: number) => void;
  onSelectedPlanChanged?: (id?: number) => void;
  onSelectedEventPlanChanged?: (id?: number) => void;
};

export const SelectableEventPlan = (props: Props) => {
  const {
    onSelectedEventChanged,
    onSelectedPlanChanged,
    onSelectedEventPlanChanged,
  } = props;

  const eventsHook = useSelectableEvents();
  const plansHook = useSelectablePlans();

  const eventPlanHook = useEventPlan({
    eventId: eventsHook.selectedId,
    planId: plansHook.selectedId,
  });

  // EVENT
  useEffect(() => {
    onSelectedEventChanged?.(eventsHook.selectedId);
  }, [onSelectedEventChanged, eventsHook.selectedId]);
  // PLAN
  useEffect(() => {
    onSelectedPlanChanged?.(plansHook.selectedId);
  }, [onSelectedPlanChanged, plansHook.selectedId]);
  // EVENT PLAN
  useEffect(() => {
    onSelectedEventPlanChanged?.(eventPlanHook.eventPlanId);
  }, [onSelectedEventPlanChanged, eventPlanHook.eventPlanId]);

  return (
    <Grid container direction="column" wrap="nowrap" rowGap="0.5rem">
      {/* CHOOSE EVENT */}
      <Grid container wrap="nowrap" overflow="auto" columnGap="0.5rem">
        <SelectableChips
          items={(eventsHook.query.data ?? []).map(({ id, name }) => ({
            id,
            text: name,
          }))}
          selectedId={eventsHook.selectedId}
          onClick={(id) => eventsHook.setSelectedId(Number(id))}
        />
      </Grid>

      {/* CHOOSE PLAN */}
      <Grid container wrap="nowrap" overflow="auto" columnGap="0.5rem">
        <SelectableChips
          items={(plansHook.query.data ?? []).map(({ id, name }) => ({
            id,
            text: name,
          }))}
          selectedId={plansHook.selectedId}
          onClick={(id) => plansHook.setSelectedId(Number(id))}
        />
      </Grid>
    </Grid>
  );
};
