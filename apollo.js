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
  uri: "http://8514-39-123-162-254.ngrok.io/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

export const cache = new InMemoryCache({
  //fetchMore 추가된데이터를 cache에 넣는 방식 설정.
  typePolicies: {
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
