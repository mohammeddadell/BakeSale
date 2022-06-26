import { StyleSheet, Text, View, Animated, Easing, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import ajax from './src/components/ajax'
import DealList from './src/components/DealList';
import DealDetail from './src/components/DealDetail';
import SearchBar from './src/components/SearchBar';
import { indexOf } from 'lodash';

export default function App() {
  const titleXPosition = new Animated.Value(0);
  const [deals, setDeals] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currDealID, setCurrDealID] = useState('');
  let dealsToDisplay = [];
  const animateTitle = (direction = 1) => {
    console.log('ANIMATE');
    const screenWidth = Dimensions.get('window').width;
    Animated.timing(
      titleXPosition,
      {
        toValue: direction * (screenWidth/2 - 100),
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: false
      }
    ).start(({finished})=> {
      if (finished){
      animateTitle(-1 * direction);
      }
    });
  }
   useEffect(()=> {
   animateTitle();
   (async() => {
      const dealsJson = await ajax.fetchInitialDeals();
      if (typeof dealsJson !== 'undefined'){
      setDeals(dealsJson);
      }
    })()
  },[]);

  const searchDeals = async (searchTerm) => {
      let dealsJson = [];
      dealsJson = await ajax.fetchDealSearchResults(searchTerm);
      setSearchResults(dealsJson);
  }
  const setCurrDeal = (dealID) => {
    setCurrDealID(dealID);
    setNextandPrev();
  }

  const currDeal = () => {
    return deals.find((deal) => deal.key === currDealID);
  }

  const setNextandPrev = () => {
    const currDealIndex = deals.indexOf(currDeal());
    let prevIndex = null;
    let nextIndex = null;
    if (currDealIndex -1 >= 0) {
      prevIndex = deals.find((el, i) =>  {return i === currDealIndex -1});
    }
    if (currDealIndex + 1 < deals.length) {
      nextIndex = deals.find((el, i) =>  { return i === currDealIndex +1} );
    }
    return [prevIndex, nextIndex];
  }

  const setDealsToDisplay = () => {
    if (searchResults.length > 0 ) {
      console.log('search results exist');
      dealsToDisplay = searchResults.slice();
      return;
    }
    if (deals.length > 0) {
      console.log('deals exist');
      dealsToDisplay = deals.slice();
      return;
    }
  }
  return (
    <>
    {
      setDealsToDisplay()
    }
      {
        currDealID ? (<View style={styles.main}><DealDetail nextAndPrev={setNextandPrev()} dealSet={setCurrDeal} initialDealData={currDeal()}></DealDetail></View>)
        : ((dealsToDisplay.length > 0) ? (<View style={styles.main}><SearchBar searchDeals={searchDeals}/><DealList deals={dealsToDisplay} onItemPress={setCurrDeal}></DealList></View>)
        : (<Animated.View style={[{left: titleXPosition}, styles.container]}><Text style={styles.header}>Bakesale</Text></Animated.View>))
      }
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    marginTop: 40,
  },
  header: {
    fontSize: 40,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
