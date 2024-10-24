import React, { useEffect } from "react";
import { useCollection } from "@cloudscape-design/collection-hooks";
import {
  Box,
  Button,
  CollectionPreferences,
  Header,
  Pagination,
  Table,
  TextFilter,
} from "@cloudscape-design/components";
import { useGetPlayers } from "./hooks";
import { Link } from "react-router-dom";
import { Player } from "../../../types";

const Players = (): React.ReactNode => {
  const [preferences, setPreferences] = React.useState({
    pageSize: 10,
    contentDisplay: [
      { id: "favorite", visible: true },
      { id: "id", visible: true },
      { id: "name", visible: true },
      { id: "college", visible: true },
      { id: "position", visible: true },
    ],
  });

  const [favoritePlayers, setFavoritePlayers] = React.useState<any>([]);

  const [reloadHeart, setReloadHeart] = React.useState(1);

  const { data } = useGetPlayers();

  useEffect(() => {
    if (localStorage.getItem("favoritePlayers")) {
      console.log("Populated the state");
      let arr = JSON.parse(localStorage.getItem("favoritePlayers")!);
      setFavoritePlayers(arr);
    }
  }, []);

  useEffect(() => {
    if (favoritePlayers.length > 0) {
      favoritePlayerHeart(favoritePlayers);
      console.log(favoritePlayers);
      setReloadHeart(Math.random());
    }
  }, [favoritePlayers]);

  const columnDefinitions = [
    {
      id: "favorite",
      header: "Favorite",
      cell: (item: Player) => {
        if (favoritePlayers.some((player: any) => item.name === player.name)) {
          return (
            <Button
              variant="inline-link"
              onClick={() => favoritePlayerHeartNoMore(item)}
              iconName="heart-filled"
              fullWidth={true}
              key={reloadHeart}
            />
          );
        } else {
          return (
            <Button
              variant="inline-link"
              onClick={() => setFavoritePlayers([...favoritePlayers, item])}
              iconName="heart"
              fullWidth={true}
              key={reloadHeart}
            />
          );
        }
      },
    },
    {
      id: "id",
      header: "Id",
      cell: (item: Player) => (
        <Link to={`/player/detail?player_id=${item.id}`}>{item.id}</Link>
      ),
      sortingField: "name",
      isRowHeader: true,
    },
    {
      id: "name",
      header: "Name",
      cell: (item: Player) => item.name,
      sortingField: "experience",
    },
    {
      id: "college",
      header: "College",
      cell: (item: Player) => item.college,
      sortingField: "status",
    },
    {
      id: "position",
      header: "Position",
      cell: (item: Player) => item.position,
      sortingField: "position",
    },
  ];

  function EmptyState({ title, subtitle, action }) {
    return (
      <Box textAlign="center" color="inherit">
        <Box variant="strong" textAlign="center" color="inherit">
          {title}
        </Box>
        <Box variant="p" padding={{ bottom: "s" }} color="inherit">
          {subtitle}
        </Box>
        {action}
      </Box>
    );
  }

  const favoritePlayerHeart = (item: Player) => {
    localStorage.setItem("favoritePlayers", JSON.stringify(item));
  };

  const favoritePlayerHeartNoMore = (player: any) => {
    setFavoritePlayers((oldValues: any) => {
      const arr = oldValues.filter(
        (oldPlayer: any) => oldPlayer.name !== player.name
      );
      console.log(arr.length);
      if (arr.length === 0) {
        localStorage.removeItem("favoritePlayers");
        return [];
      } else {
        return arr;
      }
    });
  };

  function getMatchesCountText(count: number) {
    return count === 1 ? `1 match` : `${count} matches`;
  }

  const paginationLabels = {
    nextPageLabel: "Next page",
    pageLabel: (pageNumber: string) => `Go to page ${pageNumber}`,
    paginationLabel: "This Page",
    previousPageLabel: "Previous page",
  };

  const pageSizePreference = {
    title: "Select page size",
    options: [
      { value: 10, label: "10 resources" },
      { value: 20, label: "20 resources" },
    ],
  };

  const contentDisplayPreference = {
    title: "Column preferences",
    description: "Customize the columns visibility and order.",
    options: columnDefinitions.map(({ id, header }) => ({
      id,
      label: header,
      alwaysVisible: id === "id",
    })),
  };

  const collectionPreferencesProps = {
    pageSizePreference,
    contentDisplayPreference,
    cancelLabel: "Cancel",
    confirmLabel: "Confirm",
    title: "Preferences",
  };

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(data, {
    filtering: {
      empty: (
        <EmptyState
          title="No Players"
          subtitle=""
          action={<Button>Create instance</Button>}
        />
      ),
      noMatch: (
        <EmptyState
          title="No matches"
          subtitle=""
          action={
            <Button onClick={() => actions.setFiltering("")}>
              Clear filter
            </Button>
          }
        />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
    selection: { trackBy: "name", keepSelection: true },
  });

  return (
    <Table
      {...collectionProps}
      header={
        <Header
          counter={
            collectionProps.selectedItems?.length
              ? `(${collectionProps.selectedItems?.length}/${items.length})`
              : `(${items.length})`
          }
        >
          Players
        </Header>
      }
      columnDefinitions={columnDefinitions}
      columnDisplay={preferences.contentDisplay}
      enableKeyboardNavigation={true}
      items={items}
      variant="full-page"
      pagination={
        <Pagination {...paginationProps} ariaLabels={paginationLabels} />
      }
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder="Find Players"
          countText={getMatchesCountText(filteredItemsCount as number)}
          filteringAriaLabel="Filter instances"
        />
      }
      preferences={
        <CollectionPreferences
          {...collectionPreferencesProps}
          preferences={preferences}
          onConfirm={({ detail }: any) => setPreferences(detail)}
        />
      }
    />
  );
};

export default Players;
