import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Linking,
  TextInput,
  Button,
} from 'react-native';
import {AsyncStorage} from 'react-native'

export class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign in with Flowdock',
    headerLeft: null
  };

  constructor(props) {
    super(props);

    this.state = {
      apiToken: ''
    }

    this.handleApiTokenChangeText = this.handleApiTokenChangeText.bind(this);
    this.handleButtonPress        = this.handleButtonPress.bind(this);
  }

  componentDidMount() {
    const self = this;

    AsyncStorage.getItem('Settings').then((settingsStr) => {
      self.setState({ apiToken: JSON.parse(settingsStr).flowdockToken });
    });
  }

  handleApiTokenChangeText(text) {
    this.setState({
      apiToken: text.toLowerCase()
    });
  }

  handleButtonPress() {
    AsyncStorage.setItem('Settings', JSON.stringify({
      flowdockToken: this.state.apiToken
    }));

    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.getApiToken}
          onPress={() => Linking.openURL('https://www.flowdock.com/account/tokens')}>
          Get API token!
        </Text>

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
          onChangeText={this.handleApiTokenChangeText}
          value={this.state.apiToken}
        />

        <Button
          onPress={this.handleButtonPress}
          disabled={this.state.apiToken === ''}
          title='Done'
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  getApiToken: {
    fontSize: 20,
    textAlign: 'center',
    color: '#0074D9',
  }
});
