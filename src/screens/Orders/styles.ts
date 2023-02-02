import styled, { css } from 'styled-components/native';
import { FlatList, FlatListProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const Header = styled(LinearGradient).attrs(({ theme }) => ({
  colors: theme.COLORS.GRADIENT,
}))`
  padding: ${getStatusBarHeight() + 33}px 0 33px;
`;

export const Title = styled.Text`
  font-size: 24px;
  text-align: center;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.TITLE};
    color: ${theme.COLORS.TITLE};
  `}
`;

export const OrderList = styled(
  FlatList as new (props: FlatListProps<any>) => FlatList<any>,
).attrs({
  contentContainerStyle: {
    paddingBottom: 125,
    paddingHorizontal: 24,
  },
  showsVerticalScrollIndicator: false,
  numColumns: 2,
})``;
