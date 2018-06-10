import { getAllSearchResultPages } from '../helpers/apiHelpers'
import Config from '../constants/config'
import Toast from 'react-native-simple-toast'

export const SEARCH = "search"
export const SEARCH_SUCCESS = "search_success"
export const SEARCH_FAILED = "search_failed"
export const SEARCH_EMPTY = "search_empty"
export const SEARCH_CLEAR = "search_clear"

export const searchQuery = searchText => dispatch => {
  // Search Is Empty
  if(searchText.trim().length === 0) return dispatch({type: SEARCH_EMPTY})

  // Search Started
  dispatch({type: SEARCH})

  
  const filter = `meta.app:${Config.app.name} AND `
  const query = `(${filter}${searchText} NOT nsfw)`

  getAllSearchResultPages(query)
  .then(data => {
    let searchResults = []
    data.forEach(result => searchResults = [...searchResults, ...result.results])
    // Search Success
    dispatch({type: SEARCH_SUCCESS, payload: {searchResults}})
    // Show Notification For No Results
    if(searchResults.length === 0){
      Toast.show("No Results", Toast.SHORT)
    }
  })
  .catch(err => {
    // Search Failed
    dispatch({type: SEARCH_FAILED})
    // Notification
    Toast.show("No Results", Toast.LONG)
  })
}

export const clearSearchForm = () => {
  return {type: SEARCH_CLEAR}
}
