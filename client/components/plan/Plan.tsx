import { useMemo } from 'react';
import { useEventPlan } from '@/hooks/eventPlan/useEventPlan';
import Grid from '@mui/material/Grid2';
import { Seat } from './Seat';

type Props = {
  eventId: number;
  planId: number;
};

export const Plan = ({ eventId, planId }: Props) => {
  const eventPlanHook = useEventPlan({ eventId, planId });

  const planSchema = useMemo(() => {
    return eventPlanHook.query.data?.plan;
  }, [eventPlanHook.query.data?.plan]);

  const cols = useMemo(() => {
    return Array.from({ length: planSchema?.width ?? 0 }, (_, i) => i);
  }, [planSchema?.width]);
  const rows = useMemo(() => {
    return Array.from({ length: planSchema?.height ?? 0 }, (_, i) => i);
  }, [planSchema?.height]);

  return (
    <table
      style={{
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <tbody>
        {rows.map((row) => (
          <tr key={row}>
            {cols.map((col) => (
              <td
                key={col}
                style={{
                  border: '1px solid black',
                }}
              >
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                  overflow="hidden"
                  style={{
                    aspectRatio: '1 / 1',
                  }}
                >
                  <Seat id={`${row} - ${col}`} />
                  {/* <Grid style={{ opacity: 1 }}>{row} - {col}</Grid> */}
                </Grid>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
