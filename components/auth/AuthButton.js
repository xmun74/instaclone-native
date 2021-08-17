import React from "react";
import styled from "styled-components/native";
import { colors } from "../../color";

const Button = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 13px 10px;
  margin-top: 20px;
  border-radius: 3px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;

export default function AuthButton({ onPress, disabled, text }) {
  return (
    <Button onPress={onPress} disabled={disabled}>
      <ButtonText>{text}</ButtonText>
    </Button>
  );
}
