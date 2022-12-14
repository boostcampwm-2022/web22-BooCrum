import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    width: 100%;
    height: 100%;
  }
  h3{
    padding: 0;
  }
  body, p {
    margin: 0;
  }
`;

export const theme = {
	logo: '#2071ff',
	gray_1: '#d9d9d9',
	gray_2: '#d8d8d8',
	gray_3: '#777777',
	gray_4: '#282828',
	blue_1: '#005CFD',
	blue_2: '#2071FF',
	blue_3: '#5794FF',
	red: '#FF4B4B',
	black: '#000000',
	white: '#ffffff',
};
