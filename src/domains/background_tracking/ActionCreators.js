import { Platform } from "react-native";
import {
  START_GPS,
  STOP_GPS,
  PUSH_GPS_COORD,
  PUSH_GPS_LOG,
  DEFAULT_TRACKING_STATE
} from "./ActionTypes";
import BackgroundGeolocation from "react-native-mauron85-background-geolocation";

export function startGps() {
  return function(dispatch) {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false, // test per berto
      startForeground: false,
      notificationIconColor: "#e33",
      // notificationIconLarge: "ic_launcher",
      // notificationIconSmall: "ic_stat_muv_logo",
      notificationTitle: "",
      notificationText: "Background tracking",
      saveBatteryOnBackground: false
    });

    BackgroundGeolocation.on("authorization", status => {
      this.pushGpsLog(status, dispatch);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        Alert.alert(
          "Location services are disabled",
          "Would you like to open location settings?",
          [
            {
              text: "Yes",
              onPress: () =>
                Platform.OS !== "ios"
                  ? Platform.Version < 23
                    ? BackgroundGeolocation.showLocationSettings()
                    : BackgroundGeolocation.showAppSettings()
                  : BackgroundGeolocation.showAppSettings()
            },
            {
              text: "No",
              onPress: () => alert("App requires gps to work"),
              style: "cancel"
            }
          ]
        );
      } else if (Platform.OS !== "ios") {
        // controllo se il gps è attivo
        BackgroundGeolocation.checkStatus(status => {
          if (!status.locationServicesEnabled) {
            Alert.alert(
              "Location services are disabled",
              "Would you like to open location settings?",
              [
                {
                  text: "Yes",
                  onPress: () => BackgroundGeolocation.showAppSettings()
                },
                {
                  text: "No",
                  onPress: () => alert("App requires gps to work"),
                  style: "cancel"
                }
              ]
            );
          }
        });
      }
    });

    BackgroundGeolocation.on("background", () => {
      this.pushGpsLog("[INFO] App is in background", dispatch);
    });

    BackgroundGeolocation.on("foreground", () => {
      this.pushGpsLog("[INFO] App is in foreground", dispatch);
    });

    BackgroundGeolocation.on("start", () => {
      this.pushGpsLog(
        "[INFO] BackgroundGeolocation service has been started",
        dispatch
      );
    });

    BackgroundGeolocation.on("stop", () => {
      this.pushGpsLog(
        "[INFO] BackgroundGeolocation service has been stopped",
        dispatch
      );
    });

    BackgroundGeolocation.on("error", error => {
      this.pushGpsLog(JSON.stringify(error), dispatch);
    });

    BackgroundGeolocation.on("location", location => {
      BackgroundGeolocation.startTask(taskKey => {
        this.pushGpsCoord(location, dispatch);
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.checkStatus(status => {
      this.pushGpsLog(JSON.stringify(status), dispatch);
      // per android devo vedere se il gps è attivo
      if (Platform.OS !== "ios" && !status.locationServicesEnabled) {
        Alert.alert(
          "Location services are disabled",
          "Would you like to open location settings?",
          [
            {
              text: "Yes",
              onPress: () =>
                Platform.OS !== "ios"
                  ? Platform.Version < 23
                    ? BackgroundGeolocation.showLocationSettings()
                    : BackgroundGeolocation.showLocationSettings()
                  : BackgroundGeolocation.showAppSettings()
            },
            {
              text: "No",
              onPress: () => alert("App requires gps to work"),
              style: "cancel"
            }
          ]
        );
      } else if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
    dispatch({
      type: START_GPS,
      payload: {}
    });
  };
}

export function stopGps() {
  return function(dispatch) {
    BackgroundGeolocation.checkStatus(({ isRunning, authorization }) => {
      if (isRunning) {
        console.log("stop");
        BackgroundGeolocation.stop();
        BackgroundGeolocation.events.forEach(event => {
          BackgroundGeolocation.removeAllListeners(event);
        });
      }
    });
    dispatch({
      type: STOP_GPS,
      payload: {}
    });
  };
}

pushGpsCoord = (gpsCoordObj, dispatch) => {
  console.log(gpsCoordObj);
  dispatch({
    type: PUSH_GPS_COORD,
    payload: {
      lat: gpsCoordObj.latitude,
      lon: gpsCoordObj.longitude,
      t: new Date().toLocaleTimeString()
    }
  });
};

pushGpsLog = (gpsLogObj, dispatch) => {
  // console.log(gpsLogObj);
  dispatch({
    type: PUSH_GPS_LOG,
    payload: gpsLogObj
  });
};

export function setDefaultSetting() {
  return function(dispatch) {
    dispatch({
      type: DEFAULT_TRACKING_STATE,
      payload: {}
    });
  };
}
