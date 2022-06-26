import { StyleSheet, TextInput, View } from 'react-native';
import propTypes from 'prop-types';
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';


export default function SearchBar ({searchDeals}) {
    const [searchTerm, setSearchTerm] = useState('');
    const delayedSearch = debounce(searchDeals, 300);
    const handleChange = (text) => {
        setSearchTerm(text);
    }
    useEffect(() => {
        delayedSearch(searchTerm);

    }, [searchTerm]);

    return(
        <TextInput style={styles.input}
        placeholder="Search all deals"
        onChangeText={handleChange}
        />
    )
}
SearchBar.propTypes = {
    searchDeals: propTypes.func
}

const styles = StyleSheet.create({
    input: {
        height:40,
        paddingTop:10,
        marginHorizontal:12
    }
});