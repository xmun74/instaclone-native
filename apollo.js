import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLoggedInVar = makeVar(false); //makeVar은 기본값 false다
export const tokenVar = makeVar("");

export const logUserIn = async (token) => {
  // 1. 토큰을 AsyncStorage에 저장
  await AsyncStorage.multiSet([
    ["token", token],
    ["loggedIn", "yes"],
  ]);
  isLoggedInVar(true);
  tokenVar(token); // token을 variable에 저장
};

const client = new ApolloClient({
  // 나중에 http 인증때문에 바꿔야 한다. 일단은 이렇게 진행
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export default client;
