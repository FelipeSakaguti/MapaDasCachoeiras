import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    city: string;
    uf: string;
  };
  caracs: {
    title: string;
  }[];
}

const Detail = () => {
    const [data, setData] = useState<Data>({} as Data);

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(()=>{
      api.get(`points/${routeParams.point_id}`).then(response => {
        setData(response.data);
      })
    },[])

    function handleNavigateBack(){
        navigation.goBack();
    }

    if (!data.point ){
      return null;
    }

    return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
            </TouchableOpacity>

            <Image style={styles.pointImage} source={{uri: data.point.image_url}} />

            <Text style={styles.pointName}>{data.point.name}</Text>
            <Text style={styles.pointItems}>{data.caracs.map(item => item.title).join(', ')}</Text>

            <View style={styles.address}>
                <Text style={styles.addressTitle}>Localização</Text>
                <Text style={styles.addressContent}>{data.point.city}, {data.point.uf } </Text>
            </View>

        </View>
        <View style={styles.footer}>
            <RectButton style={styles.button} onPress={()=>{}} >
                <FontAwesome name="map-marker" size={20} color="#FFF" />
                <Text style={styles.buttonText} >GoogleMaps</Text>
            </RectButton>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20 + Constants.statusBarHeight,
      position: 'relative'
    },
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'column',
      paddingBottom: 15
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });

export default Detail;