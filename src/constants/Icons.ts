import { IconName } from "../types/icon";

export const Icons = {
  ADD: "plus",
  ALBUM: "book",
  ALBUM_VIDEO: "video",
  ANGLE_LEFT: "angle left",
  ANNOUNCE: "bullhorn",
  BASE_LAYER: "map",
  CAMERA: "camera",
  CLEAR_BUTTON: "close",
  CLOSE: "close",
  CLOSE_SIDE_MENU: "angle left",
  COPY: "copy",
  COURSE: "route",
  CREATE: "plus",
  CREATE_CURRENT_POSITION_PIN_BUTTON: "crosshairs",
  CURRENT_POSITION: "crosshairs",
  DELETE: "trash",
  DESCRIPTION: "comment alternate",
  DEVICE: "cube",
  DONE: "check",
  DRAWING: "paint brush",
  EDIT: "edit",
  ERROR: "exclamation circle",
  EVENT_CLOSE: "trash",
  EVENT_COMMENT: "comment",
  EVENT_EDIT_INCIDENT: "map pin",
  EVENT_IMAGE: "image",
  EVENT_NOTIFICATION: "bell",
  EVENT_REOPEN: "redo",
  EVENT_STREAMING_VIDEO: "video",
  EVENT_VIDEO: "film",
  FILE: "file alternate outline",
  FILTER: "filter",
  FULLSCREEN_COMPRESS: "compress",
  FULLSCREEN_EXPAND: "expand",
  HOME: "home",
  IMAGE: "file image",
  INFORMATION: "info",
  LABORATORY: "flask",
  LAYER: "layer group",
  LOADING: "circle notched",
  MAP: "map marked alternate",
  MARKER: "map marker alternate",
  MEMBER: "user",
  ORGANIZATION: "building",
  PIN: "map pin",
  PLAY: "play circle outline",
  QR: "qrcode",
  SEARCH: "search",
  SEND: "paper plane",
  SETTINGS: "setting",
  SIGN_OUT: "sign out",
  SWITCH: "random",
  TEAM: "users",
  TIMELINE: "history",
  USER: "user",
  VIDEO: "file video",
  YES: "check",
} as const;

// 型チェック用
Icons as { [key: string]: IconName };