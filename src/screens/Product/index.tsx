import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useRoute, useNavigation } from '@react-navigation/native';

import { ProductNavigationProps } from '@src/@types/navigation';

import { ButtonBack } from '@components/ButtonBack';
import { Photo } from '@components/Photo';
import { InputPrice } from '@components/InputPrice';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ProductProps } from '@components/ProductCard';

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Invisible,
  Form,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCharacters,
  DescriptionInput,
} from './styles';

type PizzaResponse = ProductProps & {
  photo_path: string;
  price_sizes: {
    p: string;
    m: string;
    g: string;
  };
};

export function Product() {
  const [photoPath, setPhotoPath] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;

  async function handlePickerImage() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 160,
      maxHeight: 160,
    });

    const uri = result?.assets?.[0]?.uri;

    if (!result.didCancel && uri) {
      setImage(uri);
    }
  }

  async function handleAdd() {
    if (!name.trim()) {
      return Alert.alert('Cadastro', 'Informe o nome da pizza.');
    }

    if (!description.trim()) {
      return Alert.alert('Cadastro', 'Informe a descrição da pizza.');
    }

    if (!image) {
      return Alert.alert('Cadastro', 'Selecione a imagem da pizza.');
    }

    if (!priceSizeP || !priceSizeM || !priceSizeG) {
      return Alert.alert(
        'Cadastro',
        'Informe o preço de todos os tamanhos da pizza.',
      );
    }

    setIsLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);

    await reference.putFile(image);

    const photo_url = await reference.getDownloadURL();

    firestore()
      .collection('pizzas')
      .add({
        name,
        name_insensitive: name.toLowerCase().trim(),
        description,
        price_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath,
      })
      .then(() => navigation.navigate('home'))
      .catch(() => {
        setIsLoading(false);
        Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.');
      });
  }

  function handleDelete() {
    firestore()
      .collection('pizzas')
      .doc(id)
      .delete()
      .then(() => {
        storage()
          .ref(photoPath)
          .delete()
          .then(() => {
            navigation.navigate('home');
          });
      });
  }

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then(response => {
          const product = response.data() as PizzaResponse;
          setName(product.name);
          setImage(product.photo_url);
          setDescription(product.description);
          setPriceSizeP(product.price_sizes.p);
          setPriceSizeM(product.price_sizes.m);
          setPriceSizeG(product.price_sizes.g);
          setPhotoPath(product.photo_path);
        });
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleGoBack} />

          <Title>Cadastrar</Title>

          {id ? (
            <TouchableOpacity onPress={handleDelete}>
              <DeleteLabel>Deletar</DeleteLabel>
            </TouchableOpacity>
          ) : (
            <Invisible />
          )}
        </Header>

        <Upload>
          <Photo uri={image} />
          {!id && (
            <PickImageButton
              title="Carregar"
              type="secondary"
              onPress={handlePickerImage}
            />
          )}
        </Upload>

        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCharacters>0 de 60 caracteres</MaxCharacters>
            </InputGroupHeader>
            <DescriptionInput
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e preços</Label>
            <InputPrice
              size="P"
              onChangeText={setPriceSizeP}
              value={priceSizeP}
            />
            <InputPrice
              size="M"
              onChangeText={setPriceSizeM}
              value={priceSizeM}
            />
            <InputPrice
              size="G"
              onChangeText={setPriceSizeG}
              value={priceSizeG}
            />
          </InputGroup>

          {!id && (
            <Button
              title="Cadastrar pizza"
              isLoading={isLoading}
              onPress={handleAdd}
            />
          )}
        </Form>
      </ScrollView>
    </Container>
  );
}