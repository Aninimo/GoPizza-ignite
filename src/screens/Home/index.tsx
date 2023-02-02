import React, { useState, useCallback } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'styled-components/native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import happyEmoji from '@assets/images/happy.png';

import { useAuth } from '@hooks/auth';
import { Search } from '@components/Search';
import { ProductCard, ProductProps } from '@components/ProductCard';

import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Header,
  Title,
  MenuHeader,
  MenuItemsNumber,
  ProductList,
  NewProductButton,
} from './styles';

export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState('');

  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  function fetchPizzas(value: string) {
    const formattedValue = value.toLowerCase().trim();

    firestore()
      .collection('pizzas')
      .orderBy('name_insensitive')
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ProductProps[];

        setPizzas(data);
      })
      .catch(() =>
        Alert.alert('Consulta', 'Não foi possível realizar a consulta.'),
      );
  }

  function handleSearch() {
    fetchPizzas(search);
  }

  function handleSearchClear() {
    setSearch('');
    fetchPizzas('');
  }

  function handleOpen(id: string) {
    const route = user?.isAdmin ? 'product' : 'order';
    navigation.navigate(route, { id });
  }

  function handleAdd() {
    navigation.navigate('product', {});
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas('');

      return () => setSearch('');
    }, []),
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, {user?.name || 'Usuário'}.</GreetingText>
        </Greeting>

        <TouchableOpacity onPress={signOut}>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
      </MenuHeader>

      <ProductList
        data={pizzas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
      />

      {user?.isAdmin && (
        <NewProductButton
          title="Cadastrar Pizza"
          type="secondary"
          onPress={handleAdd}
        />
      )}
    </Container>
  );
}
