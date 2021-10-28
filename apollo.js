import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLoggedInVar = makeVar(false); //makeVar은 기본값 false다
export const tokenVar = makeVar("");

const TOKEN = "token";

export const logUserIn = async (token) => {
  // 1. 토큰을 AsyncStorage에 저장
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token); // token을 variable에 저장
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
};

const httpLink = createHttpLink({
  // uri: "http://localhost:4000/graphql",
  uri: "http://402d-39-123-162-254.ngrok.io/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(), //호출만하면 현재 value를 받아옴. (값)입력하면 해당value로 변경하는 것
    },
  };
});

export const cache = new InMemoryCache({
  //cache를 export해서 다른곳에서 restore하기 한다.(App.js에서)
  //fetchMore로 추가된데이터를 cache에 넣는 데이터 처리방식을 설정해준다.
  typePolicies: {
    //typePolicies: apollo에게 type을 설정할 수 있도록 해줌(지금 설정할 type은 Query다.)
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(), // 기존데이터유지 + 새로운데이터 뒤에 넣는 방식
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export default client;
