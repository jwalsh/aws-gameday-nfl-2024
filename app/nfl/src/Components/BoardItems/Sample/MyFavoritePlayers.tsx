import React, { useEffect } from "react";
import Grid from "@cloudscape-design/components/grid";
import Avatar from "@cloudscape-design/chat-components/avatar";

import "./MyFavoritePlayers.css";

const MyFavoritePlayers = (): React.ReactNode => {
  var myGridDefinition = [{ colspan: 6 }, { colspan: 6 }];

  useEffect(() => {});

  const players = () => {
    if (localStorage.getItem("favoritePlayers")) {
      //console.log(JSON.parse(localStorage.getItem("favoritePlayers")!))
      const favoritePlayers = JSON.parse(
        localStorage.getItem("favoritePlayers")!
      );
      const numberOfRow = favoritePlayers.length / 2;
      for (let index = 0; index < numberOfRow; index++) {
        myGridDefinition.push({ colspan: 6 }, { colspan: 6 });
      }
      return favoritePlayers.map((player: any) => {
        const initial =
          player.name.split(" ")[0].substr(0, 1) +
          player.name.split(" ")[1].substr(0, 1);
        const myCentering = {
          margin: "auto",
          textAlign: "center",
        };
        return (
          <div style={myCentering}>
            <Avatar
              ariaLabel="Avatar of ${player.name} "
              initials={initial}
              tooltipText={player.name}
            />
            {player.name}
          </div>
        );
      });
    } else {
    }
  };

  return <Grid gridDefinition={myGridDefinition}>{players()}</Grid>;
};

export default MyFavoritePlayers;
