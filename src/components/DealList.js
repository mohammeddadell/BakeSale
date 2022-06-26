import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import propTypes from 'prop-types';
import DealItem from './DealItem';
import { useEffect } from 'react';

export default function DealList ({deals, onItemPress}) {
    return (
        <View style={styles.list}>
            <FlatList data={deals} renderItem={({item}) => <DealItem onPress={onItemPress} deal={item}/>}/>
        </View>
    )
}

DealList.propTypes = {
    deals: propTypes.array.isRequired,
    onItemPress: propTypes.func
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#eee',
    }
});