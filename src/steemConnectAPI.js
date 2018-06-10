import sc2 from 'sc2-sdk';

const steemConnectAPI = sc2.Initialize({
  app: 'what.app',
  callbackURL: 'https://what-app.io/callback.php',
  accessToken:  '',
  scope: ['login', 'vote', 'comment', 'comment_options', 'custom_json']
});


export default steemConnectAPI;