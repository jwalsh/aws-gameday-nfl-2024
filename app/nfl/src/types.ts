import { BoardProps } from "@cloudscape-design/board-components";
import React from "react";

export type BoardItemsType = BoardProps.Item<DataItem>;

export interface DataItem {
  title: string;
  content: React.ReactNode;
}

export type Player = {
  id: string;
  college: string;
  position: string;
  name: string;
};

export type GetPlayerResponse = {
  birth_date: string;
  college: string;
  height: string;
  sk: string;
  position: string;
  pk: string;
  weight: string;
  name: string;
};
