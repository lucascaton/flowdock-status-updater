import React, { Component } from 'react';
import {AsyncStorage} from 'react-native'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { SignInScreen } from './SignInScreen';

export default class FlowdockStatusUpdater extends Component {
  static navigationOptions = {
    title: 'Flowdock Status Updater'
  };

  constructor(props) {
    super(props);

    this.state = {
      apiToken: '',
      flowId:   'Loading...',
    }

    this.handleGoodMorningAllPress = this.handleGoodMorningAllPress.bind(this);
    this.handleAFKPress            = this.handleAFKPress.bind(this);
    this.handleLunchPress          = this.handleLunchPress.bind(this);
    this.handleGoodNightAllPress   = this.handleGoodNightAllPress.bind(this);
  }

  componentDidMount() {
    const self = this;

    AsyncStorage.getItem('Settings').then((settingsStr) => {
      const flowdockToken = JSON.parse(settingsStr).flowdockToken;

      if (flowdockToken === undefined || flowdockToken === '') {
        this.props.navigation.navigate('SignIn');
      } else {
        self.setState({
          apiToken: flowdockToken
        }, () => {
          fetch('https://api.flowdock.com/flows', {
            method: 'get',
            headers: { 'Authorization': `Basic ${btoa(flowdockToken)}` },
          })
            .then((response) => response.json())
            .then((flows) => {
              this.setState({
                flowId: flows.filter((flow) => flow.name === 'Velvet Corgi Lounge')[0].id
              });
            })
            .catch((error) => { console.error(error); });
        });
      }
    });
  }

  setFlowdockStatus(content, event) {
    fetch('https://api.flowdock.com/messages', {
      method: 'post',
      headers: {
        'Authorization': `Basic ${btoa(this.state.apiToken)}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: `flow=${this.state.flowId}&event=${event}&content=${content}`,
    })
      .then((response) => response.json())
      .then((response) => { console.log(response); })
      .catch((error)   => { console.error(error); });
  }

  handleGoodMorningAllPress() {
    this.setFlowdockStatus('Good morning all', 'message');
  }

  handleAFKPress() {
    this.setFlowdockStatus('AFK', 'status');
  }

  handleLunchPress() {
    this.setFlowdockStatus('Lunch', 'status');
  }

  handleGoodNightAllPress() {
    this.setFlowdockStatus('Good night all', 'message');
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.apiData}>
          <Text style={{fontWeight: 'bold'}}>API token:</Text>
          <Text style={styles.pre} onPress={() => navigate('SignIn')}>{this.state.apiToken}</Text>
        </View>

        <View style={styles.apiData}>
          <Text style={{fontWeight: 'bold'}}>Flow ID:</Text>
          <Text style={styles.pre}>{this.state.flowId}</Text>
        </View>

        {this.state.apiToken === '' ?
          <View style={styles.actions}>
            <Button title='Sign In' onPress={() => navigate('SignIn')} />
          </View>
        :
          <View style={styles.actions}>
            <Text>Send:</Text>
            <Button title='Good morning all' onPress={this.handleGoodMorningAllPress} />
            <Button title='AFK'              onPress={this.handleAFKPress} />
            <Button title='Lunch'            onPress={this.handleLunchPress} />
            <Button title='Good night all'   onPress={this.handleGoodNightAllPress} />
          </View>
        }
      </View>
    );
  }
}

const App = StackNavigator({
  Main:   { screen: FlowdockStatusUpdater },
  SignIn: { screen: SignInScreen }
});

const styles = StyleSheet.create({
  apiData: {
    marginTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  container: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#FFF',
  },
  actions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pre: {
    fontFamily: 'menlo',
    color: '#333333',
  },
});

AppRegistry.registerComponent('FlowdockStatusUpdater', () => App);
