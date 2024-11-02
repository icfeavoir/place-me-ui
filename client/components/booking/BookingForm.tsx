import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { Button, Chip, TextField } from '@mui/material';

import { useGroups } from '../../hooks/groups/useGroups';
import { useEvents } from '@/hooks/events/useEvents';
import { useSelectableEvents } from '@/hooks/events/useSelectableEvents';
import { SelectableChips } from '../common/SelectableChips';
import { useSelectablePlans } from '@/hooks/plans/useSelectablePlans';
import { useEventPlan } from '@/hooks/eventPlan/useEventPlan';
import { useEffect } from 'react';
import { SelectableEventPlan } from '../eventPlan/SelectableEventPlan';

type Inputs = {
  name: string;
  number: number;
  eventPlanId: number;
};

export const BookingForm = () => {
  const { data, createGroupMutation } = useGroups({});

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      number: 0,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createGroupMutation.mutate({
      name: data.name,
      number: data.number,
      event_plan_id: data.eventPlanId,
    });
  };

  return (
    <>
      <p>{data.length} bookings</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          direction="column"
          wrap="nowrap"
          rowGap="0.5rem"
          padding="1rem"
        >
          <Grid>
            <SelectableEventPlan
              onSelectedEventPlanChanged={(eventPlanId) => {
                if (!eventPlanId) return;
                setValue('eventPlanId', eventPlanId);
              }}
            />
          </Grid>

          <Grid container wrap="nowrap">
            <Controller
              control={control}
              name="name"
              render={({ field }) => <TextField label="Nom" {...field} />}
            />

            <Controller
              control={control}
              name="number"
              render={({ field }) => (
                <TextField label="Nombre" type="number" {...field} />
              )}
            />
          </Grid>

          <Button variant="outlined" type="submit">
            Enregistrer
          </Button>
        </Grid>
      </form>
    </>
  );
};
