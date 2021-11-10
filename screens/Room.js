import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { FlatList, KeyboardAvoidingView, View } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import useMe from "../hooks/useMe";

// 메시지보내는 Form만들기
// 1. useForm만들고
// 2. useEffect로 register만들기
// 3. handleSubmit위한 onValid함수 생성
// 4. 작성한 SEND_MESSAGE_MUTATION 뮤테이션 쓰기

// updateSendMessage 메시지 업데이트하기
// 1. updateSendMessage 생성 후 함수호출하면 cache와 result얻음. result는 ok,id만 있어서 가짜객체만들수 있다
// 2. 뮤테이션에 update: updateSendMessage 넣고
// 3. messageObj- 가짜객체 만들고 안에는 쿼리랑 같아야함
// 4. getValues로 메시지 내용가져옴 / getValues= 가짜객체안에 payload가 됨
// 5. 가짜객체 안 username,avatar는 useMe 훅으로 가져옴
// 6. messageFragment- cache속이려고 -쿼리들만이 메시지를 cache에 넣기 가능
// 7. cache.modify - message 이전값과 새로운 값 합쳐서 리턴

// Form에서 send보내면 input창 텍스트 없애기
// 1. useForm에서 wtch사용
// 2. 업데이트할때마다 setValue("message", ""); 비워두기

// 새로운 메시지부터 자동으로 내려가서 보이게하기
// 1. FlatList inverted해서 밑에서부터 보이게하기
// 2. 새로운 메시지부터 보이게 하기
//   (백엔드에서 배열 뒤집어서 리턴 or 프론트엔드에서 reverse하기)
//   메시지배열 reverse하기
//   *reverse : JS에서 가존배열 변형시키는 함수.
//   react-native에선 strict-mode(배열 고정모드, 변형불가)기때문에 reverse가 안되는 문제발생.
//   그래서 다른 배열로 복사하고 나서 reverse하기

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;
//userId: 방에 없는 사람 초대할때 쓰려는것.나중에 방생성만들고 싶으면 사용하기
const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
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
// seeRoom안에 id가 있어야 Apollo가 인식함
const MessageContainer = styled.View`
  padding: 0px 10px;
  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end; //끝에서부터 시작하기
`;
const Author = styled.View``;
const Avatar = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 25px;
`;
const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 10px;
  font-size: 16px;
  margin: 0px 10px;
`;

const TextInput = styled.TextInput`
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  color: white;
  border-radius: 1000px;
  width: 90%;
  margin-right: 10px;
`;

const InputContainer = styled.View`
  width: 95%;
  margin-bottom: 50px;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
`;

const SendBtn = styled.TouchableOpacity``;

export default function Room({ route, navigation }) {
  const { data: meData } = useMe(); //username,avatar를 가져오기
  const { register, setValue, handleSubmit, getValues, watch } = useForm(); // -useForm만들기
  const updateSendMessage = (cache, result) => {
    // - 메시지 업데이트하기
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    if (ok && meData) {
      const { message } = getValues(); // 메시지가져와서 가짜객체 payload가 됨
      setValue("message", ""); //업데이트할때마다 input창 비우기.getValues다음에 하기
      const messageObj = {
        //가짜 객체 만들기. seeRoom안과 같아야함
        id,
        payload: message,
        user: {
          username: meData.me.username,
          avatar: meData.me.avatar,
        },
        read: true,
        __typename: "Message", //Cache 속이기 위해 넣기
      };
      const messageFragment = cache.writeFragment({
        // 메시지 캐시에 넣기
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj, //가짜객체 cache에 보내기
      });
      cache.modify({
        //seeRoom message객체 넣기
        id: `Room:${route.params.id}`, // Room 1,2,3...이런식 Aplool는 id값으로 room판별하고 있음
        fields: {
          messages(prev) {
            //이전메시지 받아서
            return [...prev, messageFragment]; //이전 메시지 , 신규메시지 배열리턴
          },
        },
      });
    }
  };
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  const client = useApolloClient();
  const updateQuery = (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;
    if (message.id) {
      const messageFragment = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: message,
      });
      client.cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };
  useEffect(() => {
    if (data?.seeRoom) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        updateQuery,
      });
    }
  }, [data]);
  const onValid = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route?.params?.id,
        },
      });
    }
  };
  useEffect(() => {
    register("message", { required: true }); // ("메시지", 요구사항임)
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      title: `${route?.params?.talkingTo?.username}`,
    });
  }, []);
  const renderItem = ({ item: message }) => (
    <MessageContainer
      outGoing={message.user.username !== route?.params?.talkingTo?.username}
    >
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
      </Author>
      <Message>{message.payload}</Message>
    </MessageContainer>
  );
  const messages = [...(data?.seeRoom?.messages ?? [])];
  //data?~가 있다면 배열안에서 ...펼쳐서 줄거고 ??존재안하면 빈배열[]주기
  messages.reverse();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior="padding"
      keyboardVerticalOffset={50}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          style={{ width: "100%", marginVertical: 10 }}
          inverted
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>} //메시지item 사이넓히기
          data={messages}
          showsVerticalScrollIndicator={false} //수직스크롤바 안보이게함
          keyExtractor={(message) => "" + message.id}
          renderItem={renderItem}
        />
        <InputContainer>
          <TextInput
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            placeholder="Write a message..."
            returnKeyLabel="Send Message"
            returnKeyType="Send"
            onChangeText={(text) => setValue("message", text)} //바뀐 text 줌. register에서 message와 같음
            onSubmitEditing={handleSubmit(onValid)}
            value={watch("message")}
          />
          <SendBtn
            onPress={handleSubmit(onValid)} //아이콘누르면 값 전달
            disabled={!Boolean(watch("message"))} //입력창 비었으면 전부 false값 돼서 비활성화
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch("message")) //입력창비었으면 컬러회색
                  ? "rgba(255, 255, 255, 0.5)"
                  : "white"
              }
              size={22}
            />
          </SendBtn>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
