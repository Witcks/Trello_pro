/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import ListColumn from './ListColumns/ListColumn';
import { mapOrder } from '~/utils/sorts';
import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '~/customLibraries/DnDKitSensers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { generatePlacehoderCard } from '~/utils/formatters';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCard/Card/Card';
import { cloneDeep, isEmpty } from 'lodash';

const ACCTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'COLUMN',
  CARD: 'CARD',
};

const BoardContent = ({ board }) => {
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [activeDragItemID, setActiveDragItemID] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);

  const lastOverId = useRef(null);

  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10,
  //   },
  // });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id).includes(cardId)
    );
  };

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardID,
    active,
    over,
    activeColumn,
    activeDraggingCardID,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn.cards.findIndex(
        (card) => card._id === overCardID
      );
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn.cards.length + 1;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardID
        );

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlacehoderCard(nextActiveColumn)];
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardID
        );

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: overColumn._id,
        };

        nextOverColumn.cards.splice(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );

        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_Placeholder
        );

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      return nextColumns;
    });
  };

  const handleDragStart = (event) => {
    // console.log(event);
    setActiveDragItemID(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACCTIVE_DRAG_ITEM_TYPE.CARD
        : ACCTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  const handleDragOver = (event) => {
    if (activeDragItemType === ACCTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    const { active, over } = event;

    if (!active || !over) return;

    const {
      id: activeDraggingCardID,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardID } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardID);
    const overColumn = findColumnByCardId(overCardID);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardID,
        active,
        over,
        activeColumn,
        activeDraggingCardID,
        activeDraggingCardData
      );
    }
  };

  const handleDragEnd = (event) => {
    // console.log(event);
    const { active, over } = event;
    if (!active || !over) return;

    if (activeDragItemType === ACCTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardID,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardID } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardID);
      const overColumn = findColumnByCardId(overCardID);

      if (!activeColumn || !overColumn) return;

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardID,
          active,
          over,
          activeColumn,
          activeDraggingCardID,
          activeDraggingCardData
        );
      } else {
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (column) => column._id === activeDragItemID
        );
        const newCardIndex = overColumn?.cards?.findIndex(
          (column) => column._id === overCardID
        );

        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);

          const taggetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          taggetColumn.cards = dndOrderedCards;
          taggetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);

          return nextColumns;
        });
      }
    }

    if (activeDragItemType === ACCTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const olColumnIndex = orderedColumns.findIndex(
          (column) => column._id === active.id
        );
        const newColumnIndex = orderedColumns.findIndex(
          (column) => column._id === over.id
        );
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          olColumnIndex,
          newColumnIndex
        );
        // const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id);
        setOrderedColumns(dndOrderedColumns);
      }
    }

    setActiveDragItemID(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5,
        },
      },
    }),
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACCTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      const pointerIntersection = pointerWithin(args);

      if (!pointerIntersection?.length) {
        return;
      }

      // const intersection = !!pointerIntersection?.length
      //   ? pointerIntersection
      //   : rectIntersection(args);

      let overId = getFirstCollision(pointerIntersection, 'id');

      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box
        sx={{
          width: '100%,',
          height: (theme) => theme.trello.boardContentHeight,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          p: '10px 0',
        }}>
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACCTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACCTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
