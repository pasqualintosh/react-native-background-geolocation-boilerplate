import {
  START_GPS,
  STOP_GPS,
  PUSH_GPS_COORD,
  PUSH_GPS_LOG,
  DEFAULT_TRACKING_STATE
} from "./ActionTypes";
import DefaultState from "./DefaultState";

export default function backgroundTrackingReducer(
  state = DefaultState,
  action
) {
  switch (action.type) {
    case START_GPS:
      return { ...DefaultState, is_active: true };

    case STOP_GPS:
      return { ...state, is_active: false };

    case DEFAULT_TRACKING_STATE:
      return { ...DefaultState };

    case PUSH_GPS_COORD:
      return {
        ...state,
        gps_coord: [...state.gps_coord, action.payload]
      };

    case PUSH_GPS_LOG:
      return {
        ...state,
        gps_log: [...state.gps_log, action.payload]
      };

    default:
      return { ...state };
  }
}
