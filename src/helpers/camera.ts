import { Master } from "../kinesis/kinesisVideo";
import { isBoolean } from "./is";
import { isMobile, isTablet } from "react-device-detect";

export type CameraType = "front" | "back";

export const switchCamera = async (
  master: Master,
  cameraType: CameraType
): Promise<boolean> => {
  if (!isMobile && !isTablet) {
    throw Error("not mobile and not tablet");
  }
  const { stream } = master ?? {};

  if (!master || !stream) {
    throw Error("not has stream");
  }

  const facingMode =
    cameraType === "back"
      ? {
          exact: "environment",
        }
      : {};

  stream.getVideoTracks().forEach((camera) => camera.stop());

  const constraints = {
    ...DEFAULT_CONSTRAINTS,
  };

  constraints.audio = true;
  constraints.video = isBoolean(constraints.video)
    ? { facingMode }
    : constraints.video
    ? {
        ...constraints.video,
        facingMode,
      }
    : { facingMode };

  // カメラ切り替え
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack#switching_video_cameras

  const newStream = await navigator.mediaDevices.getUserMedia(constraints);

  master.stream = newStream;
  master.video.srcObject = newStream;

  const newVideoTrack = newStream.getVideoTracks()[0];

  await Object.values(master.peerConnections).forEach((pc) => {
    const sender = pc
      .getSenders()
      .find((s) => s.track?.kind === newVideoTrack.kind);
    sender?.replaceTrack(newVideoTrack);
  });

  return true;
};

export const getConstraintsByCameraType = (type: string) => {
  if (type !== "back") {
    return DEFAULT_CONSTRAINTS;
  }

  const facingMode =
    type === "back"
      ? {
          exact: "environment",
        }
      : {};

  const constraints = {
    ...DEFAULT_CONSTRAINTS,
  };

  constraints.audio = true;
  constraints.video = isBoolean(constraints.video)
    ? { facingMode }
    : constraints.video
    ? {
        ...constraints.video,
        facingMode,
      }
    : { facingMode };
  return constraints;
};

export const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: {
    height: { ideal: 480 },
    width: { ideal: 640 },
  },
};
