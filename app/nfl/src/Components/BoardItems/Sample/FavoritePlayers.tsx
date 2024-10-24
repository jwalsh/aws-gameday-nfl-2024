import React, { useEffect } from "react";

const FavoritePlayers = (): React.ReactNode => {
  useEffect(() => {
    if (localStorage.getItem("favoritePlayers")) {
      console.log(JSON.parse(localStorage.getItem("favoritePlayers")!));
    }
  });
  return <></>;
};

export default FavoritePlayers;
