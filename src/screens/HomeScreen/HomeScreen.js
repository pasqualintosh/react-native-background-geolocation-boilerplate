import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  ScrollView
} from "react-native";
import { connect } from "react-redux";

import {
  startGps,
  stopGps,
  setDefaultSetting
} from "./../../domains/background_tracking/ActionCreators";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.props.dispatch(setDefaultSetting());
  }

  renderBtnString() {
    if (
      this.props.trackingState != undefined &&
      this.props.trackingState.is_active == false
    )
      return "START";
    else if (
      this.props.trackingState != undefined &&
      this.props.trackingState.is_active == true
    )
      return "STOP";
    else return "LOADING ...";
  }

  render() {
    console.log(this.props);
    return (
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.5,
            height: 80,
            backgroundColor: "#ee333350",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              if (
                this.props.trackingState != undefined &&
                this.props.trackingState.is_active == false
              )
                this.props.dispatch(startGps());
              else if (
                this.props.trackingState != undefined &&
                this.props.trackingState.is_active == true
              )
                this.props.dispatch(stopGps());
              else alert("LOADING ...");
            }}
          >
            <View>
              <Text>{this.renderBtnString()}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#33ee3350"
          }}
        >
          <Text>Gps coord:</Text>
          {this.props.trackingState ? (
            this.props.trackingState.gps_coord.map((item, index) => (
              <Text key={index}>{JSON.stringify(item)}</Text>
            ))
          ) : (
            <Text />
          )}
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3333ee50"
          }}
        >
          <Text>Logs:</Text>
          {this.props.trackingState ? (
            this.props.trackingState.gps_log.map((item, index) => (
              <Text key={index}>{JSON.stringify(item)}</Text>
            ))
          ) : (
            <Text />
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    width: Dimensions.get("window").width
  }
});

const withBakcgroundTracking = connect(state => {
  return {
    trackingState: state.tracking
  };
});

export default withBakcgroundTracking(HomeScreen);
