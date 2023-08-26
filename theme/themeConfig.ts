import { Button, type ThemeConfig } from "antd";
import { styled } from "styled-components";
import { theme } from "antd";

const { darkAlgorithm } = theme;

const customTheme: ThemeConfig = {
  token: {
    colorPrimary: "#642AB5",
  },
  algorithm: darkAlgorithm,
};

export const FFButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default customTheme;
