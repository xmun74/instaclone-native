import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const MessageText = styled.Text`
  margin-top: 15px;
  color: white;
  font-weight: 600;
`;

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 1);
  color: black;
  width: ${(props) => props.width / 1.5}px;
  padding: 5px 10px;
  border-radius: 7px;
`;

export default function Search({ navigation }) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS);
  //useQuery: 바로실행되서 useLazyQuery: 바로 실행되지 않는 쿼리 사용.
  //검색버튼누를때(startQueryFn함수부를때)만 검색하려고
  const onValid = ({ keyword }) => {
    //onValid: 현재 데이터받음
    startQueryFn({
      variables: {
        keyword,
      },
    });
  };
  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor="rgba(0, 0, 0, 0.8)"
      placeholder="Search photos"
      autoCapitalize="none" //키보드 소문자로 변경
      returnKeyLabel="Search" //키보드 제출문자변경 (android)
      returnKeyType="Search" // "" (ios)
      autoCorrect={false} // 자동완성 끔
      onChangeText={(text) => setValue("keyword", text)} //글자적으면 keyword에 text값으로 변경
      onSubmitEditing={handleSubmit(onValid)} //버튼누르면 실행됨
    />
  );
  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox, //1. 헤더타이틀에 검색창을 넣기
    });
    register("keyword", {
      //register등록하기.
      required: true,
      minLength: 3, //글자길이 최소3글자 적어서 제출가능
    });
  }, []);
  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Photo", {
          photoId: photo.id,
        })
      }
    >
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / numColumns, height: 100 }}
      />
    </TouchableOpacity>
  );
  return (
    <DismissKeyboard>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size="large" />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? ( //함수가 호출안됐으면
          <MessageContainer>
            <MessageText>Search by keyword.</MessageText>
          </MessageContainer>
        ) : null}
        {data?.searchPhotos !== undefined ? (
          data?.searchPhotos?.length === 0 ? ( //검색했지만 아무것도 못찾았으면
            <MessageContainer>
              <MessageText>Could not find anything.</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              numColumns={numColumns} //검색후 찾으면, 4열로 이미지 배열하기
              data={data?.searchPhotos}
              keyExtractor={(photo) => "" + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null}
      </View>
    </DismissKeyboard>
  );
}
