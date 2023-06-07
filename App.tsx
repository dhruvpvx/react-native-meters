import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WeightMeter } from './src/components';
import MeasureScale from './MeasureScale';

export default function App() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 50,
          color: 'black',
        }}
      >
        Expo 48.0.15
      </Text>
      <MeasureScale points={180} devideBy={10} active={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
