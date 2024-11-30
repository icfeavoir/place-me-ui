import { Plan } from '@/components/plan/Plan';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import { SelectableEventPlan } from '@/components/eventPlan/SelectableEventPlan';
import { useCallback, useEffect, useState } from 'react';
import { useGroups } from '@/hooks/groups/useGroups';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function TabTwoScreen() {
  const [selectedEventId, setSelectedEventId] = useState<number>();
  const [selectedPlanId, setSelectedPlanId] = useState<number>();
  const [selectedEventPlanId, setSelectedEventPlanId] = useState<number>();

  const { data: groups } = useGroups({ eventPlanId: selectedEventPlanId });

  const [scale, setScale] = useState(1);

  const onZoom = useCallback((ref: ReactZoomPanPinchRef) => {
    setScale(ref.instance.transformState.scale);
  }, []);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <>
      <Grid
        container
        direction="column"
        wrap="nowrap"
        padding="1rem"
        rowGap="1rem"
        height="100%"
      >
        <Grid>
          <SelectableEventPlan
            onSelectedEventChanged={setSelectedEventId}
            onSelectedPlanChanged={setSelectedPlanId}
            onSelectedEventPlanChanged={setSelectedEventPlanId}
          />
        </Grid>

        <DndContext>
          <Grid height={0} flex={1} container wrap="nowrap" rowGap="1rem">
            {/* LEFT: LIST GROUPS */}
            <Grid
              border="1px solid black"
              padding="0.5rem"
              width="10rem"
              height="100%"
              overflow="auto"
            >
              <Grid container direction="column" rowGap="0.25rem">
                {groups.map(({ id, name }) => (
                  <Grid key={id} border="1px solid blue">
                    {name}
                  </Grid>
                ))}
                <Grid
                  border="1px solid red"
                  ref={setNodeRef}
                  style={style}
                  {...listeners}
                  {...attributes}
                >
                  TEST
                </Grid>
              </Grid>
            </Grid>

            <Grid
              height="100%"
              flex={1}
              bgcolor="rgba(0,0,0,0.1)"
              padding="1rem"
              overflow="auto"
            >
              {/* <TransformWrapper
              onZoom={onZoom}
              minScale={0.9}
              wheel={{
                smoothStep: 0.005,
              }}
            >
              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                }}
                contentStyle={{
                  width: '100%',
                  height: '100%',
                }}
              > */}
              <span
                style={{
                  width: '100%',
                  fontSize: `${0.8 / scale}rem`,
                }}
              >
                {selectedEventId && selectedPlanId && (
                  <Plan eventId={selectedEventId} planId={selectedPlanId} />
                )}
              </span>
              {/* </TransformComponent>
            </TransformWrapper> */}
            </Grid>
          </Grid>
        </DndContext>
      </Grid>
    </>
  );
}
