import { Button, Input, type ThemeConfig } from 'antd';
import { styled } from 'styled-components';
import { theme } from 'antd';

const { darkAlgorithm } = theme;

const customTheme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: '#642AB5',
  },
  algorithm : darkAlgorithm
};

export const FFButton = styled(Button)`
    display: flex;
    align-items: center;
`;

export default customTheme;