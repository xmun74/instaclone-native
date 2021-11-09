import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;

export default function Room({ route, navigation }) {
  const { data } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  useEffect(() => {
    navigation.setOptions({
      title: `${route?.params?.talkingTo?.username}`,
    });
  }, []);
  console.log(data);
  return (
    <View>
      <Text>Messages List</Text>
    </View>
  );
}
