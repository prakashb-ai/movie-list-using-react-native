import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, StatusBar, TextInput } from 'react-native';

const API_KEY = 'eaa140e84a644984c7315b0c19c5d0c5';
const API_URL = 'https://api.themoviedb.org/3/discover/movie';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (pageNumber = 1) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?api_key=${API_KEY}&page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('API Response:', data);

      if (pageNumber === 1) {
        setMovies(data.results);
      } else {
        setMovies(prevMovies => [...prevMovies, ...data.results]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
      fetchMovies(page + 1);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text === '') {
      setPage(1);
      fetchMovies(); 
      return;
    }
  
    const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(text.toLowerCase()));
    setMovies(filteredMovies);
  };

  const renderMovieItem = ({ item }) => (
    <View style={styles.movieItem}>
      <Image
        style={styles.posterImage}
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
      />
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        onChangeText={handleSearch}
        value={searchQuery}
        onSubmitEditing={() => handleSearch(searchQuery)}
      />
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading && <ActivityIndicator style={styles.loadingIndicator} size="large" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  posterImage: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
});

export default MovieList;
