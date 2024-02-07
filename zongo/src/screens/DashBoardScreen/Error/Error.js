

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { resetScreen } from '../../../navigation/RootNavigation';
import { greenPrimary } from '../../../constants/Color';

const Error = ({ navigation }) => {
  const handleGoBack = () => {
    resetScreen("Home")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Forbidden Error!</Text>
      <Text style={styles.errorMessage}>You do not have permission to view this resource.</Text>
      <Button  color={greenPrimary} title="Back to Home" onPress={handleGoBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Error;
