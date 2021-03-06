import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../../services/api';

interface Caracs {
  id: number;
  title: string,
  image_url: string;
}

interface Point {
  id_points: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
    const [caracs, setCaracs] = useState<Caracs[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [selectedCaracs, setSelectedCaracs] = useState<number[]>([])

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(()=>{
      async function loadPosition(){
        const { status } = await Location.requestPermissionsAsync();

        if (status !== 'granted'){
          Alert.alert('Oooooops...','Precisamos de sua permissão para obter a sua localização')
          return;
        }

        const location = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = location.coords;

        setInitialPosition([latitude,longitude]);
      }

      loadPosition();
    },[])

    useEffect(()=>{
        api.get('caracs').then(response => {
          setCaracs(response.data)
        });
    },[])

    useEffect(() => {
      api.get('points',{
        params:{
          city: routeParams.city,
          uf: routeParams.uf,
          caracs: selectedCaracs
        }
      }).then(response => {
        setPoints(response.data)
      })
    },[selectedCaracs])

    function handleSelectedCarac(id: number){
      const alreadySelected = selectedCaracs.findIndex(item => item === id);

      if(alreadySelected >= 0){
        const filteredCaracs = selectedCaracs.filter(item => item !== id);

        setSelectedCaracs(filteredCaracs);
      } else {
        setSelectedCaracs([...selectedCaracs, id]);
      }
    }

    function handleNavigateBack(){
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number){
        navigation.navigate('Detail', { point_id: id });
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre as cachoeiras no mapa.</Text>

                <View style={styles.mapContainer}>
                  { initialPosition[0] !== 0 && (
                    <MapView 
                    style={styles.map} 
                    initialRegion={{
                        latitude: initialPosition[0],
                        longitude: initialPosition[1],
                        latitudeDelta: 0.100,
                        longitudeDelta: 0.100
                    }}>
                      {points.map(point =>(
                        <Marker
                          key={String(point.id_points)}
                          style={styles.mapMarker}
                          onPress={() => handleNavigateToDetail(point.id_points)}
                          coordinate={{
                              latitude: point.latitude,
                              longitude: point.longitude,
                          }}
                        >
                            <View style={styles.mapMarkerContainer}>
                                <Image 
                                  style={styles.mapMarkerImage} 
                                  source={{ uri: point.image_url}}
                                />
                                <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                            </View>
                        </Marker>
                      ))}
                    </MapView>
                  ) }
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  {caracs.map(caracs => (
                    <TouchableOpacity 
                      key={String(caracs.id)} 
                      style={[
                        styles.item, 
                        selectedCaracs.includes(caracs.id) ? styles.selectedItem : {}
                      ]} 
                      onPress={()=>handleSelectedCarac(caracs.id)}
                      activeOpacity={0.4}
                    >
                      <SvgUri width={50} height={50} uri={caracs.image_url} />
                      <Text style={styles.itemTitle}>{caracs.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;