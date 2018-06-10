import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { getWhatCategory, getWhatTags, getDescription, hasMarkedAnswer } from '../helpers/questionHelpers'

import { 
  askFormUpdate, 
  askFormSet, 
  askFormClear, 
  createPost 
} from '../editor/editorActions'

import { 
  StyleProvider, Container, Content, Item, Input, Switch, Left, Right, Text, H2, Spinner, View, Button
} from 'native-base'

import theme from '../theme/components'
import material from '../theme/variables/material'

import Header  from '../components/headers'
import Footer from '../components/footers/footerButton'

import BodyPreview from '../editor/bodyPreview'

import Config from '../constants/config'
import { getIsPosting, getAuthenticatedUser } from '../reducers';


class Ask extends Component {
  constructor(props){
    super(props)
  }

  state = {
    title: this.props.title,
    category: this.props.category,
    body: this.props.body,
    tags: this.props.tags,
    powerUp: this.props.powerUp,
    preview: false
  }

  handleSubmit(isUpdating = false){
    const { authenticatedUser } = this.props
    const { title, category, body, tags, powerUp } = this.state

    // Update in Redux State
    this.props.askFormSet({title, category, body, tags, powerUp})

    // Set Permlink and Parent Permlink To Existing Post If Updating
    let permlink = ''
    let defaultParentPermlink = Config.question.parentPermlink

    if(isUpdating){ 
      permlink = this.props.question.permlink
      defaultParentPermlink = this.props.question.parent_permlink
    }

    // Create JSON Metadata
    const jsonMetadata = {
      community: Config.app.name,
      app: `${Config.app.name}/${Config.app.version}`,
      description: body,
      tags: tags.length === 0 ? 
        [defaultParentPermlink, category] 
        : [defaultParentPermlink, category, ...tags.replace(/\s\s+/g, ' ').trim().split(' ')],
      image: [Config.question.thumbnailLink]
    }

    if(isUpdating){
      const markedAnswer = hasMarkedAnswer(this.props.question)
      if(markedAnswer && markedAnswer.id) jsonMetadata.answer = markedAnswer
    }

    // Create Body To Display In Steemit/Other Steem Apps
    const newBody = 
`**Question:** ${title}

${body}

${Config.question.footer}`

    const postData = {
      title: title.trim(),
      author: authenticatedUser.user,
      permlink,
      parentAuthor: '',
      parentPermlink: defaultParentPermlink,
      category,
      body: newBody,
      tags,
      reward: powerUp ? '100' : '50',
      isUpdating,
      jsonMetadata,
    }

    this.props.createPost(postData)
  }

  componentDidMount(){
    if(this.props.isEditing) {
      const {question} = this.props
      const {title} = question
      const category = getWhatCategory(question)
      const tags = getWhatTags(question).join(" ")
      const body = getDescription(question)
      this.setState({title, category, body, tags})
    }
  }

  componentWillUnmount(){
    if(this.props.isEditing){
      this.props.askFormClear(); this.setState({
        title: '',
        category: '',
        body: '',
        tags: '',
        powerUp: false
      })
    }else {
      const {title, category, body, tags, powerUp} = this.state;
      this.props.askFormSet({title, category, body, tags, powerUp})
    }
  }


  handleLogoCLick(){
    Actions.feed()
  }
  
  render() {
    const { bgColorStyle, inputStyle, bodyInputStyle, paddingStyle, titleInputStyle, tagsContainerStyle, previewContainerStyle } = styles;

    const isEditing = this.props.isEditing || false

    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header
            headerBack
            onLogoClick={this.handleLogoCLick}
          />
          <Content>
            <Item style={paddingStyle}>
              <Input 
                style={titleInputStyle}
                multiline={true}
                numberOfLines={3}
                blurOnSubmit={false}
                placeholder="Enter Question Title..." 
                value={this.state.title}
                onChangeText={value => this.setState({title: value})}
              />
            </Item>
            <Item style={paddingStyle}>
              <Input 
                style={inputStyle}
                placeholder="Type in a category to post in..." 
                value={this.state.category}
                onChangeText={value => this.setState({ category: value.replace(/[^a-zA-z0-9-]/g, '').toLowerCase() })}
              />
            </Item>
            {
              this.state.body.length > 0 && 
                <View style={previewContainerStyle}>
                  <Button onPress={() => this.setState({preview: !this.state.preview})} rounded>
                    <Text>{ this.state.preview ? 'Edit' : 'Preview' }</Text>
                  </Button>
                </View>
            }
            <Item style={paddingStyle}>
              {
                this.state.preview ?
                <View style={{padding: 10}}>
                  <BodyPreview>
                    {this.state.body.trim()}
                  </BodyPreview>
                </View>
                :
                <Input 
                  style={bodyInputStyle}
                  numberOfLines={2}
                  multiline={true}
                  placeholder="Enter body (optional) (markdown accepted)" 
                  value={this.state.body}
                  onChangeText={value => this.setState({ body: value })}
                />
              }
              
            </Item>
            <Item style={paddingStyle}>
              <Input 
                style={inputStyle}
                placeholder="Enter tags (seperate by space - 3 max)" 
                value={this.state.tags}
                onChangeText={value => this.setState({ tags: value.replace(/[^a-zA-z0-9\s-]/g, '').toLowerCase() })}
              />
            </Item>
            {
              !this.props.isEditing && 
              <Item style={paddingStyle}>
                <Left>
                  <Text style={{fontSize: 14}}>Power Up 100%</Text>
                </Left>
                <Right>
                  <Switch 
                    value={this.state.powerUp} 
                    onValueChange={value => this.setState({ powerUp: value })}
                  />
                </Right>
              </Item>
            }
          </Content>
          {
            !this.props.isPosting ?

            !isEditing ?
            <Footer onClick={() => this.handleSubmit()}>
              Post Question
            </Footer>
            :
            <Footer onClick={() => this.handleSubmit(true)}>
              Save
            </Footer>
            :
            <View><Spinner /></View>
          }
        </Container>
      </StyleProvider>
    )
  }
}

const mapStateToProps = state => {
  const { title, category, body, tags, powerUp } = state.editor.question
  return {
    title, 
    category, 
    body, 
    tags, 
    powerUp, 
    isPosting: getIsPosting(state), 
    authenticatedUser: getAuthenticatedUser(state)
  }
}

export default connect(mapStateToProps, { askFormUpdate, askFormSet, askFormClear, createPost })(Ask)

const styles = {
  bgColorStyle: {
    backgroundColor: '#fafafa'
  },
  titleInputStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 0,
  },
  bodyInputStyle: {
    fontSize: 14
  },
  inputStyle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  bodyPreviewHeader: {
    padding: 10,
    justifyContent: 'center'
  },
  previewContainerStyle: {
    padding: 10,
    flex: 1
  },
  paddingStyle: {
    padding: 10
  }
}