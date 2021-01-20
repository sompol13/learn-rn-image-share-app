import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  },
})

const ReuseableButton = ({ onPress, label, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  )
}

export default ReuseableButton
