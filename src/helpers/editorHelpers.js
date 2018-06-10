import Config from '../constants/config'

export const validateTitle = (title) => {
  title = title.trim()

  if(title.length < 7 || title.length > 255) { return false } else { return true }
  /*
  const titleStarters = ['who', 'what', 'when', 'where', 'how', 'why', 'is', 'could']

  let titleIsValid = false

  titleStarters.forEach(word => {
    if(title.toLowerCase().startsWith(word) && !titleIsValid) titleIsValid = true
  })
  
  return titleIsValid
  */
}

export const validateCategory = (category) => {
  category = category.trim()
  if(category.length === 0 || category.length >  18) return false 
  if( /\s/g.test(category)) return false

  return true
}

export const validateTags = (tags) => {
  tags = tags.trim()
  if(tags.length === 0) return true

  tags = tags.replace(/\s\s+/g, ' ').split(' ')
  if(tags.length > 3) return false
  
  let tagsIsValid = false
  tags.forEach(tag => validateCategory(tag) ? tagsIsValid = true : tagsIsValid = false)
  
  return tagsIsValid
}

  // Create Post Data
export const createPostData = (body, parent, author, permlink, isUpdating) => {
  return {
    parentAuthor: parent.author,
    parentPermlink: parent.permlink,
    author,
    permlink,
    title: '',
    category: parent.category,
    body,
    jsonMetadata: {
      tags:[parent.category], 
      app: `${Config.app.name}/${Config.app.version}`
    },
    reward: '50',
    isUpdating
  }
}