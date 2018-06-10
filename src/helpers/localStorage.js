import { AsyncStorage } from 'react-native'

export const store = (key, value) => {
  try {
    AsyncStorage.setItem(key, value)
  } catch(error){
    // Didn't save
  }
}

export const remove = (key) => {
  try {
    AsyncStorage.removeItem(key)
  } catch(error){
    // Didn't remove or didn''t exist
  }
}

