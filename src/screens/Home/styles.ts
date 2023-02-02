import styled, { css } from 'styled-components/native';
import { FlatList, FlatListProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';

import { ProductProps } from '@components/ProductCard';
import { Button } from '@components/Button';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const Header = styled(LinearGradient).attrs(({ theme }) => ({
  colors: theme.COLORS.GRADIENT,
}))`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: ${getStatusBarHeight() + 33}px 24px 58px;
`;

export const Greeting = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const GreetingEmoji = styled.Image`
  width: 32px;
  height: 32px;
  margin-right: 12px;
`;

export const GreetingText = styled.Text`
  font-size: 20px;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.TITLE};
    color: ${theme.COLORS.TITLE};
  `}
`;

export const MenuHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 25px 24px 0;
  padding-bottom: 22px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.COLORS.SHAPE};
`;

export const MenuItemsNumber = styled.Text`
  font-size: 14px;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.TEXT};
    color: ${theme.COLORS.SECONDARY_900};
  `}
`;

export const Title = styled.Text`
  font-size: 22px;
  line-height: 20px;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.TITLE};
    color: ${theme.COLORS.SECONDARY_900};
  `}
`;

export const ProductList = styled(
  FlatList as new (
    props: FlatListProps<ProductProps>,
  ) => FlatList<ProductProps>,
).attrs({
  contentContainerStyle: {
    paddingTop: 20,
    paddingBottom: 125,
    marginHorizontal: 24,
  },
  showsVerticalScrollIndicator: false,
})``;

export const NewProductButton = styled(Button)`
  margin: 0 24px;
  margin-bottom: ${getBottomSpace() + 12}px;
`;
