import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const App = props => {
  return(
    <View style={styles.screen}>
      <Text>This is the main Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;