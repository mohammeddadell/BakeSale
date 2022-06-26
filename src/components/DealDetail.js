import { StyleSheet, Image, ScrollView, View, Text, PanResponder, Animated, TouchableOpacity, Button, Dimensions, Linking } from 'react-native';
import propTypes from 'prop-types';
import { priceDisplay } from '../util';
import { useState, useEffect } from 'react';
import ajax from './ajax';

export default function DealDetail ({nextAndPrev, initialDealData, dealSet}) {
  const [deal, setDeal] = useState(initialDealData);
  const [imageIndex, setImageIndex] = useState(0);
  const imageXPosition = new Animated.Value(0);
  const detailsXPoition = new Animated.Value(0);
  const screenWidth = Dimensions.get('window').width;
  const dealPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: ()=> true,
    onPanResponderMove: (evt, gs) => {
      detailsXPoition.setValue(gs.dx);
     },
    onPanResponderRelease: (evt,gs) => { 
      if (Math.abs(gs.dx) > screenWidth * 0.3) {
        const swipeDirection = Math.sign(gs.dx);
        //swipe left if 40% in the left
        // sign - for left and + for right
        Animated.timing(detailsXPoition, {
          toValue: swipeDirection*screenWidth,
          duration:250,
          useNativeDriver: false
        }).start(()=> {handleDealSwipe(-1*swipeDirection)});
    }
  }});
  const imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: ()=> true,
    onPanResponderMove: (evt, gs) => {
      imageXPosition.setValue(gs.dx);
    },
    onPanResponderRelease: (evt,gs) => {
      if (Math.abs(gs.dx) > screenWidth * 0.4) {
        const swipeDirection = Math.sign(gs.dx);
        //swipe left if 40% in the left
        // sign - for left and + for right
        Animated.timing(imageXPosition, {
          toValue: swipeDirection*screenWidth,
          duration:250,
          useNativeDriver: false
        }).start(()=> {handleImageSwipe(-1*swipeDirection)});
      }
      else {
        Animated.spring(imageXPosition, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  });
  const handleImageSwipe = (swipeDirection) => {
    if((swipeDirection === -1 && imageIndex !== 0) || (swipeDirection === 1 && imageIndex !== deal.media.length -1)){
    setImageIndex((prevIndex) => {return prevIndex + swipeDirection});
    }
    else {
      Animated.spring(imageXPosition, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  }

  const handleDealSwipe = (swipeDirection) => {
    if(swipeDirection === 1 && nextAndPrev[1] !== null){
      setDeal(nextAndPrev[1]);
      }
      else if(swipeDirection === -1 && nextAndPrev[0] !== null){
        setDeal(nextAndPrev[0]);
        }
      else {
        Animated.spring(detailsXPoition, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
  }
  useEffect(() => {
    //animate enxt image
    imageXPosition.setValue(screenWidth);
    Animated.spring(imageXPosition, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [imageIndex]);
  useEffect(() => {
    dealSet(deal.key);
    console.log('currDeal', deal);
    (async() => {
      const detailsJason = await ajax.fetchDealDetails(deal.key);
      if (detailsJason.key !== deal.key) {
        setDeal(detailsJason);
      }
    })()
    //animate enxt image
    detailsXPoition.setValue(screenWidth);
    Animated.spring(detailsXPoition, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [deal]);
  useEffect(()=> {
    (async() => {
      const detailsJason = await ajax.fetchDealDetails(deal.key);
      setDeal(detailsJason);
    })()
    console.log(nextAndPrev);
  },[]);

  const openDealURL = () => {
    Linking.openURL(deal.url);
  }
    return (
        <View style={styles.deal}>
          <TouchableOpacity onPress={()=> {dealSet(null)}}>
            <Text style={styles.backLink}>Back</Text>
          </TouchableOpacity>
            <Animated.Image {...imagePanResponder.panHandlers} style={[{left: imageXPosition }, styles.image]} source={{uri: deal.media[imageIndex]}}/>
            <View>
          <Text style={styles.title}>{deal.title}</Text>
        </View>
        <ScrollView {...dealPanResponder.panHandlers} style={styles.detail}>
            <View style={styles.footer}>
            <View style={styles.info}>
              <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
              <Text style={styles.cause}>{deal.cause.name}</Text>
            </View>
            {deal.user && (
              <View style={styles.user}>
                <Image
                  source={{ uri: deal.user.avatar }}
                  style={styles.avatar}
                />
                <Text>{deal.user.name}</Text>
              </View>
            )}
          </View>
            <View style={styles.description}>
              <Text>{deal.description}</Text>
            </View>
            <Button title='Buy this deal' onPress={openDealURL} />
            </ScrollView>
        </View>
    )
}

DealDetail.propTypes = {
  initialDealData: propTypes.object.isRequired,
  dealSet: propTypes.func,
  nextAndPrev: propTypes.array
}

const styles = StyleSheet.create({
  deal: {
    marginBottom: 20,
  },
  backLink: {
    marginBottom: 5,
    color: '#22f',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  info: {
    alignItems: 'center',
  },
  user: {
    alignItems: 'center',
  },
  cause: {
    marginVertical: 10,
  },
  price: {
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  description: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'dotted',
    margin: 10,
    padding: 10,
  },
});