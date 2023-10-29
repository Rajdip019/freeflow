import { Button, Collapse, type ThemeConfig } from "antd";
import { styled } from "styled-components";
import { theme } from "antd";

const { darkAlgorithm } = theme;

const customTheme: ThemeConfig = {
  components: {
    Collapse: {},
  },
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

export const StyledCollapse = styled(Collapse)`
  &&& {
    background: rgb(20, 20, 20);
  }
`;

export default customTheme;
