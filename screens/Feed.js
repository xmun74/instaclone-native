import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default function Feed() {
  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const renderPhoto = ({ item: photo }) => {
    //:photo로 rename함.
    return <Photo {...photo} />; // Photo 리턴
  };

  //새로고침하면 refetch하고 다시 기본값false로 해두기
  const refresh = async () => {
    setRefreshing(true);
    await refetch(); //refetch: 쿼리불러오는 함수
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.02} // 리스트 끝 지정함. 0이상의 숫자 값.(0:완전 리스트 끝/1:스크롤안해도 바로 끝이라고 인식)
        // onEndReached: native에서 사용자가 리스트끝에 도달했을때 호출되는 함수
        onEndReached={() =>
          fetchMore({
            //fetchMore: apollo에서 기존결과 유지 + 새로운결과 패치하는 함수. apollo.js에서 정의해줘야 함
            variables: {
              offset: data?.seeFeed?.length, //현재 list의 길이만큼만 표시(현재 2개만 표시됨)
            },
          })
        }
        refreshing={refreshing} //refreshing 이 boolean이고 onRefresh가 존재할때만 동작한다.
        onRefresh={refresh} //onRefresh는 당기고 나서 새로고침되는 함수 호출함.
        style={{ width: "100%" }} //가로 꽉채우기
        showsVerticalScrollIndicator={false} //옆 스크롤바 안보이게하기
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id} //사진의 유니크한 key. /string이어야해서 ""+ 추가함.
        renderItem={renderPhoto} // 사진들 렌더링하는 함수
      />
    </ScreenLayout>
  );
}
