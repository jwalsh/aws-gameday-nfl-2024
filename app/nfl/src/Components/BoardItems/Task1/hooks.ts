import { useState, useEffect } from "react";
import { GetPlayerResponse, Player } from "../../../types";
import { DynamoDB } from "aws-sdk";

const dynamodb = new DynamoDB.DocumentClient({
  region: 'us-west-2',
});

// Transform DynamoDB item to Player interface
const transformToPlayer = (item: any): Player => ({
  id: item.pk.S,
  name: item.name.S,
  position: item.position.S,
  college: item.college.S,
});

export const useGetPlayers = () => {
  const [data, setData] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const params = {
          TableName: "NflPlayerTable",
          Select: "ALL_ATTRIBUTES",
        };

        // Using scan since we need all players
        const result = await dynamodb.scan(params).promise();
        
        if (result.Items) {
          const players = result.Items.map(transformToPlayer);
          setData(players);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch players');
        console.error('Error fetching players:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { data, isLoading, error };
};

export const useGetPlayerInfo = (id: string) => {
  const [data, setData] = useState<GetPlayerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const params = {
          TableName: "NflPlayerTable",
          Key: {
            "pk": id,
            "sk": id  // Note: pk and sk are the same value for players
          }
        };

        const result = await dynamodb.get(params).promise();
        
        if (result.Item) {
          setData({
            birth_date: result.Item.birth_date.S,
            college: result.Item.college.S,
            height: result.Item.height.S,
            sk: result.Item.sk.S,
            position: result.Item.position.S,
            pk: result.Item.pk.S,
            weight: result.Item.weight.S,
            name: result.Item.name.S
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch player details');
        console.error('Error fetching player details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerInfo();
  }, [id]);

  return { data, isLoading, error };
};
