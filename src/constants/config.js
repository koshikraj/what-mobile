import React from 'react'
import { Text, Image, StyleSheet, View } from 'react-native'

const hasParents = (parents, type) => {
  return parents.findIndex(el => el.type === type) > -1;
}

export const app = {
  name: 'what',
  version: '1.1.0',
  url: 'https://steemit.com?ref=what-app',
  signUpURL: 'https://signup.steemit.com'
}

export const question = {
  footer: 
`___
[Posted on What Q&A - The Q&A App on the STEEM Blockchain](https://steemit.com/@what-app)
___`,
  thumbnailLink: 'https://steemitimages.com/DQmaaTn2xBoUte3fuhSDfBKdwNefxCCg5xEQkiP4xyCQ37o/image.png',
  parentPermlink: 'what-qa'
}

export const defaultMetadata = {
  tags: [question.parentPermlink],
  app: `${app.name}/${app.version}`,
  community: app.name,
  image: [question.thumbnailLink]
}

export const steemConnectCallbackURL = {
  default: 'https://what-app.io/callback.php'
}

export const storageKey = {
  login: '@whatapp/login',
  settings: '@whatapp/settings',
  notification: '@whatapp/notification'
}

export const markdownSettings = {
  basicRules: {
    hardbreak: (node, children, parent, styles) => (
      <Text key={node.key}>{"\n"}</Text>
    )
  },
  rules: {
    image: (node, children, parent, styles) => {
      return <Image key={node.key} style={{margin: 1, maxWidth: '100%'}} source={{ uri: node.attributes.src }} />
    },
    hardbreak: (node, children, parent, styles) => (
      <Text key={node.key}>{"\n"}</Text>
    ),
    list_item: (node, children, parent, styles) => {
      if (hasParents(parent, "bullet_list")) {
        if(children["0"] === undefined || children["0"].props === undefined) return
        return (
          <View key={node.key} style={styles.listUnorderedItem}>
            <Text style={styles.listUnorderedItemIcon}>{"\u2022"}</Text>
            <Text style={[styles.listItem]}>{children["0"].props.children["0"].props.children["0"].props.children}</Text>
          </View>
        );
      }

      if (hasParents(parent, "ordered_list")) {
        if(children["0"] === undefined || children["0"].props === undefined) return
        return (
          <View key={node.key} style={styles.listOrderedItem}>
            <Text style={styles.listOrderedItemIcon}>{`${node.index + 1}.`}</Text>
            <Text style={[styles.listItem]}>{children["0"].props.children["0"].props.children["0"].props.children}</Text>
          </View>
        );
      }
      
      return (
        <View key={node.key} style={[styles.listItem]}>
          {children}
        </View>
      );
    }
  },
  style: StyleSheet.create({
    text: {color: '#000'},
    listUnorderedItemText: {lineHeight: 0},
    listUnorderedItemIcon: {lineHeight: 0, marginRight: 15},
    listOrderedItemText: {lineHeight: 0},
    listOrderedItemIcon: {lineHeight: 0, marginRight: 15, fontWeight: 'bold'}
  })
}


module.exports = {
  app,
  question,
  defaultMetadata,
  storageKey,
  steemConnectCallbackURL,
  markdownSettings
}