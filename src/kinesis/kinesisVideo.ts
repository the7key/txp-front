import {
  KinesisVideoClient,
  ListSignalingChannelsCommand,
  ChannelInfo,
  CreateSignalingChannelCommand,
  CreateSignalingChannelCommandInput,
  GetSignalingChannelEndpointCommand,
  GetSignalingChannelEndpointCommandOutput,
  ResourceEndpointListItem,
  DescribeSignalingChannelInput,
  DescribeSignalingChannelCommand,
} from "@aws-sdk/client-kinesis-video";
import {
  KinesisVideoSignalingClient,
  GetIceServerConfigCommand,
  IceServer,
  KinesisVideoSignalingClientConfig,
} from "@aws-sdk/client-kinesis-video-signaling";
import { isSafari } from "react-device-detect";
import { SignalingClient, Role } from "amazon-kinesis-video-streams-webrtc";
import { getConstraintsByCameraType } from "../helpers/camera";
import { v4 as uuid } from "uuid";

const REGION = "ap-northeast-1";
const SIGNALING_SERVICE_WSS_PING_PONG_INTERVAL_IN_MILLISECONDS = 5 * 60 * 1000;

export type Master = BaseModel & {
  blobUrl?: string;
  file?: File;
  peerConnections: RTCPeerConnections;
  recorder?: MediaRecorder;
  role: Role.MASTER;
  stream?: MediaStream;
  cameraType: string;
};

export type Viewer = BaseModel & {
  // need dummy to work on Safari.
  dummyLocalStream?: MediaStream;
  peerConnection?: RTCPeerConnection;
  role: Role.VIEWER;
};

export type Channel = ChannelInfo;

type BaseModel = {
  channelARN?: ChannelARN;
  channelName?: ChannelName;
  endpointsByProtocol?: Endpoints;
  iceServers?: Array<RTCIceServer>;
  reconnectSignaling: boolean;
  role: Role;
  signalingClient?: SignalingClient;
  video: HTMLVideoElement;
};

export type ChannelARN = string;
export type ChannelName = string;

type Protocol = "HTTPS" | "WSS" | string;

type Endpoints = {
  [key in Protocol]: string;
};

type RTCPeerConnections = {
  [key: string]: RTCPeerConnection;
};

type CreateSignalingChannelResponse = ChannelARN;

export type Channels = Array<ChannelInfo>;

const AccessKeyId = process.env.AKID || "";
const SecretAccessKey = process.env.SAK || "";

const credentials = {
  accessKeyId: AccessKeyId,
  secretAccessKey: SecretAccessKey,
};

const getKVClient = async (): Promise<KinesisVideoClient> => {
  // const credentials = await getCredentials();
  const kinesisVideoClient = await new KinesisVideoClient({
    credentials: credentials,
    region: REGION,
  });

  return kinesisVideoClient;
};

const getKVSClient = async (
  endpoint: string
): Promise<KinesisVideoSignalingClient> => {
  // const credentials = await getCredentials();
  const config: KinesisVideoSignalingClientConfig = {
    credentials,
    endpoint: endpoint,
    region: REGION,
  };
  const kinesisVideoSignalingClient = await new KinesisVideoSignalingClient(
    config
  );

  return kinesisVideoSignalingClient;
};

export const fetchChannels = async (): Promise<Channels> => {
  const client = await getKVClient();
  const command = new ListSignalingChannelsCommand({});
  const channels = await client.send(command);

  return channels.ChannelInfoList || [];
};

export type CreateChannelParams = {
  channelName: string;
};

export const createChannel = async (
  params: CreateChannelParams
): Promise<CreateSignalingChannelResponse> => {
  const client = await getKVClient();

  const createParams: CreateSignalingChannelCommandInput = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ChannelName: params.channelName,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ChannelType: "SINGLE_MASTER",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SingleMasterConfiguration: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      MessageTtlSeconds: 30,
    },
  };

  const command = new CreateSignalingChannelCommand(createParams);

  const res = await client.send(command);

  if (!res.ChannelARN) {
    throw Error;
  }

  return res.ChannelARN;
};

export const fetchMaster = async (
  video: HTMLVideoElement,
  cameraType: string,
  arn?: ChannelARN,
  name?: ChannelName
): Promise<Master> => {
  const master: Master = {
    blobUrl: undefined,
    channelARN: arn,
    channelName: name,
    peerConnections: {},
    reconnectSignaling: true,
    recorder: undefined,
    role: Role.MASTER,
    video: video,
    cameraType: cameraType,
  };

  console.log("fetch master");

  if (!master.channelARN && master.channelName) {
    master.channelARN = await fetchChannelArnByName(master);
  }

  if (!master.channelARN && !master.channelName) {
    throw Error;
  }

  master.endpointsByProtocol = await fetchEndpointsByProtocol(master);
  master.signalingClient = await fetchSignalingClient(master);

  master.iceServers = await fetchIceServers(master);

  await connectWebCamera(master);

  master.signalingClient.on("open", async () => {
    if (
      !master.signalingClient ||
      !master.endpointsByProtocol ||
      !master.iceServers
    ) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log("[MASTER] Connected to signaling service");
  });

  master.signalingClient.on("sdpOffer", async (offer, remoteClientId) => {
    // eslint-disable-next-line no-console
    console.log("[MASTER] Received SDP offer from client: " + remoteClientId);
    master.peerConnections[remoteClientId] = await fetchPeerConnection(master);

    master.peerConnections[remoteClientId].addEventListener(
      "icecandidate",
      async ({ candidate }) => {
        if (candidate) {
          // eslint-disable-next-line no-console
          console.log(
            "[MASTER] Generated ICE candidate for client: " + remoteClientId
          );

          // eslint-disable-next-line no-console
          console.log(
            "[MASTER] Sending ICE candidate to client: " + remoteClientId
          );
          master.signalingClient?.sendIceCandidate(candidate, remoteClientId);
        } else {
          // eslint-disable-next-line no-console
          console.log(
            "[MASTER] All ICE candidates have been generated for client: " +
              remoteClientId
          );
          // eslint-disable-next-line no-console
          console.log(
            "[MASTER] Sending SDP answer to client: " + remoteClientId
          );

          const description =
            master.peerConnections[remoteClientId].localDescription;
          if (description) {
            master?.signalingClient?.sendSdpAnswer(description, remoteClientId);
          } else {
            //
          }
        }
      }
    );

    master.peerConnections[remoteClientId].addEventListener("track", () => {
      // eslint-disable-next-line no-console
      console.log(
        "[MASTER] Received remote track from client: " + remoteClientId
      );
    });

    if (master.stream) {
      const stream = master.stream;
      master.stream
        .getTracks()
        .forEach((track) =>
          master.peerConnections[remoteClientId].addTrack(track, stream)
        );
    }

    await master.peerConnections[remoteClientId].setRemoteDescription(offer);

    // eslint-disable-next-line no-console
    console.log("[MASTER] Creating SDP answer for client: " + remoteClientId);
    await master.peerConnections[remoteClientId].setLocalDescription(
      await master.peerConnections[remoteClientId].createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
    );

    console.log("[MASTER] Sending SDP answer to client: " + remoteClientId);
    const description = master.peerConnections[remoteClientId].localDescription;
    if (description) {
      master.signalingClient?.sendSdpAnswer(description, remoteClientId);
    }
  });

  master.signalingClient.on(
    "iceCandidate",
    async (candidate, remoteClientId) => {
      // eslint-disable-next-line no-console
      console.log(
        "[MASTER] Received ICE candidate from client: " + remoteClientId
      );

      // sometime, run addIceCandidate before create peer connection.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add the ICE candidate received from the client to the peer connection
      if (master.peerConnections[remoteClientId]) {
        master.peerConnections[remoteClientId].addIceCandidate(candidate);
      } else {
        console.warn(
          `[MASTER SIGNALING CLIENT EVENT <iceCandidate>] peer connection with ${remoteClientId} could not be found`
        );
      }
    }
  );

  // eslint-disable-next-line no-console
  console.log("[MASTER] Starting master connection");

  master.signalingClient.on("close", () => {
    // Handle client closures
    console.warn("signalingClient close");
    if (master.reconnectSignaling) {
      console.log("recconect");
      master?.signalingClient?.open();
    }
  });

  master.signalingClient.on("error", (e) => {
    // Handle client errors
    console.error("signalingClient error", e);
  });

  master.signalingClient.on("clear", async () => {
    console.warn("Clear Master");
    await clearMaster(master);
  });

  master.signalingClient.open();

  return master;
};

const connectWebCamera = async (model: Master | Viewer) => {
  if (model.role === Role.MASTER) {
    const constraints = getConstraintsByCameraType(model.cameraType);

    try {
      model.stream = await navigator.mediaDevices.getUserMedia(constraints);
      model.video.srcObject = model.stream;
    } catch (e) {
      console.error("[MASTER] Could not find webcam");
    }
  }

  if (model.role === Role.VIEWER) {
    const constraints = {
      audio: true,
      video: true,
    };

    try {
      model.dummyLocalStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      model.dummyLocalStream
        .getTracks()
        .forEach((track) =>
          model.peerConnection?.addTrack(
            track,
            model.dummyLocalStream || new MediaStream()
          )
        );
    } catch (e) {
      console.error("[VIEWER] Could not find webcam");
    }
  }
};

const fetchEndpointsByProtocol = async (
  model: BaseModel
): Promise<Endpoints> => {
  const client = await getKVClient();

  const command = new GetSignalingChannelEndpointCommand({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ChannelARN: model.channelARN,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SingleMasterChannelEndpointConfiguration: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Protocols: ["WSS", "HTTPS"],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Role: model.role,
    },
  });

  const res: GetSignalingChannelEndpointCommandOutput = await client.send(
    command
  );

  if (res.ResourceEndpointList) {
    const endpointsByProtocol = await res.ResourceEndpointList.reduce(
      (endpoints: Endpoints, endpoint: ResourceEndpointListItem) => {
        if (endpoint.Protocol && endpoint.ResourceEndpoint) {
          endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
        }
        return endpoints;
      },
      {}
    );

    return endpointsByProtocol;
  }

  return {};
};

const fetchSignalingClient = async (
  model: BaseModel
): Promise<SignalingClient> => {
  if (!model.endpointsByProtocol?.WSS) {
    throw Error("[fetchSignalingClient] endpoint could not be found");
  }

  if (!model.channelARN) {
    throw Error("[fetchSignalingClient] channel arn could not be found");
  }

  // const credentials = await getCredentials();
  // const { accessKeyId, secretAccessKey, sessionToken } = await credentials();
  const clientId = uuid();
  const signalingClient = await new SignalingClient({
    channelARN: model.channelARN,
    channelEndpoint: model.endpointsByProtocol.WSS,
    clientId: model.role === Role.VIEWER ? clientId : undefined,
    credentials: credentials,
    region: REGION,
    role: model.role,
  });

  return signalingClient;
};

const fetchIceServers = async (
  model: BaseModel
): Promise<Array<RTCIceServer>> => {
  if (!model.endpointsByProtocol?.HTTPS) {
    throw Error("[fetchIceServers] endpoint could not be found");
  }

  const client = await getKVSClient(model.endpointsByProtocol.HTTPS);

  const command = new GetIceServerConfigCommand({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ChannelARN: model.channelARN,
  });

  const res = await client.send(command);

  if (res.IceServerList) {
    const iceServers: Array<RTCIceServer> = [];
    const servers: Array<IceServer> = res.IceServerList;

    servers.forEach((server) =>
      iceServers.push({
        credential: server.Password,
        urls: server.Uris || [],
        username: server.Username,
      })
    );

    iceServers.push({
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        `stun:stun.kinesisvideo.${REGION}.amazonaws.com:443`,
      ],
    });

    return iceServers;
  } else {
    throw Error("could not be found ICE servers at fetch ice servers");
  }
};

const fetchPeerConnection = async (
  model: BaseModel
): Promise<RTCPeerConnection> => {
  const configuration: RTCConfiguration = {
    iceServers: model.iceServers,
    iceTransportPolicy: "all",
  };

  const connection = await new RTCPeerConnection(configuration);
  return connection;
};

const fetchChannelArnByName = async (
  model: BaseModel
): Promise<string | undefined> => {
  if (model.channelARN) {
    return model.channelARN;
  }
  if (!model.channelName) return;

  const client = await getKVClient();

  const params: DescribeSignalingChannelInput = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ChannelName: model.channelName,
  };

  const command = new DescribeSignalingChannelCommand(params);

  const res = await client.send(command);

  if (!res.ChannelInfo?.ChannelARN) {
    throw Error;
  }

  return res.ChannelInfo.ChannelARN;
};

const clearMaster = async (master: Master) => {
  if (master.signalingClient) {
    master.reconnectSignaling = false;
    master.signalingClient.close();
    master.signalingClient = undefined;
  }

  if (master.peerConnections) {
    Object.keys(master.peerConnections).forEach((clientId) => {
      master.peerConnections[clientId].close();
    });
    master.peerConnections = {};
  }

  if (master.video) {
    master.video.pause();
    master.video.srcObject = null;
  }
  if (master.stream) {
    master.stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
};

export const fetchViewer = async (
  video: HTMLVideoElement,
  arn: ChannelARN
): Promise<Viewer> => {
  const viewer: Viewer = {
    channelARN: arn,
    reconnectSignaling: true,
    role: Role.VIEWER,
    video: video,
  };

  viewer.endpointsByProtocol = await fetchEndpointsByProtocol(viewer);

  viewer.iceServers = await fetchIceServers(viewer);

  viewer.signalingClient = await fetchSignalingClient(viewer);

  viewer.peerConnection = await fetchPeerConnection(viewer);

  if (isSafari) await connectWebCamera(viewer);

  viewer.signalingClient?.on("open", async () => {
    if (
      !viewer.signalingClient ||
      !viewer.endpointsByProtocol ||
      !viewer.iceServers ||
      !viewer.peerConnection
    ) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log("[VIEWER] Connected to signaling service");

    // eslint-disable-next-line no-console
    console.log("[VIEWER] Creating SDP offer");
    await viewer.peerConnection.setLocalDescription(
      await viewer.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
    );

    if (viewer.peerConnection.localDescription) {
      // eslint-disable-next-line no-console
      console.log("[VIEWER] Sending SDP offer");
      viewer.signalingClient.sendSdpOffer(
        viewer.peerConnection.localDescription
      );
    } else {
      throw Error;
    }

    window.setInterval(
      sendPing,
      SIGNALING_SERVICE_WSS_PING_PONG_INTERVAL_IN_MILLISECONDS,
      viewer
    );
  });

  // When the SDP answer is received back from the master, add it to the peer connection.
  viewer.signalingClient.on("sdpAnswer", async (answer) => {
    if (!viewer.peerConnection) {
      throw Error(
        "[VIEWER] could not be found peer connection at setRemoteDescription."
      );
    }
    // eslint-disable-next-line no-console
    console.log("[VIEWER] Received SDP answer");
    if (viewer.peerConnection.signalingState !== "stable") {
      await viewer.peerConnection.setRemoteDescription(answer);
    }
  });

  viewer.signalingClient.on("iceCandidate", (candidate) => {
    if (!viewer.peerConnection) {
      throw Error(
        "[VIEWER] could not be found peer connection at addIceCandidate."
      );
    }
    // eslint-disable-next-line no-console
    console.log("[VIEWER] Received ICE candidate");
    viewer.peerConnection.addIceCandidate(candidate);
  });

  viewer.signalingClient.on("close", () => {
    // Handle client closures
    console.warn("signalingClient close");

    if (viewer.reconnectSignaling) {
      viewer?.signalingClient?.open();
    }
  });

  viewer.signalingClient.on("error", (err) => {
    // Handle client errors
    console.error("signalingClient error", err);
  });

  viewer.signalingClient.on("clear", () => {
    // Handle client closures
    console.warn("Clear Viewer");
    clearViewer(viewer);
  });

  // Send any ICE candidates generated by the peer connection to the other peer
  viewer.peerConnection.onicecandidate = ({ candidate }) => {
    if (candidate) {
      // eslint-disable-next-line no-console
      console.log("[VIEWER] Sending ICE candidate");
      viewer.signalingClient?.sendIceCandidate(candidate);
    } else {
      // eslint-disable-next-line no-console
      console.log("[VIEWER] All ICE candidates have been generated");

      // No more ICE candidates will be generated
      if (!viewer?.peerConnection?.localDescription) {
        console.warn(
          "[VIEWER] could not be found local description at sendSdpOffer"
        );
        return;
      }
    }
  };

  // As remote tracks are received, add them to the remote view
  viewer.peerConnection.addEventListener("track", (event) => {
    // eslint-disable-next-line no-console
    console.log("[VIEWER] Received remote track");

    if (event.streams[0]) {
      viewer.video.srcObject = event.streams[0];
    }
  });

  // handle disconnect
  viewer.peerConnection.addEventListener("iceconnectionstatechange", () => {
    // eslint-disable-next-line no-console
    console.log(
      "on iceconnectionstatechange. iceState:",
      viewer.peerConnection?.iceConnectionState,
      " signalingState:",
      viewer.peerConnection?.signalingState
    );
    if (viewer.peerConnection?.iceConnectionState === "failed") {
      console.warn("remote peer closed");
      clearViewer(viewer);
    }

    if (viewer.peerConnection?.iceConnectionState === "disconnected") {
      viewer.signalingClient?.close();
    }
  });

  // eslint-disable-next-line no-console
  console.log("[VIEWER] Starting viewer connection");
  viewer.signalingClient.open();

  return viewer;
};

const sendPing = (viewer: Viewer) => {
  if (viewer.signalingClient) {
    // eslint-disable-next-line no-console
    console.log("[VIEWER] send ping");
    viewer.signalingClient["sendMessage"]("PING", {});
  }
};

const clearViewer = (viewer: Viewer) => {
  // eslint-disable-next-line no-console
  console.log("[VIEWER] Stopping viewer connection");
  if (viewer.signalingClient) {
    viewer.reconnectSignaling = false;
    viewer.signalingClient.close();
    viewer.signalingClient = undefined;
  }

  if (viewer.peerConnection) {
    viewer.peerConnection.close();
    viewer.peerConnection = undefined;
  }

  if (viewer.video) {
    viewer.video.pause();
    viewer.video.srcObject = null;
  }

  if (viewer.dummyLocalStream) {
    viewer.dummyLocalStream.getTracks().forEach((track) => {
      track.stop();
    });
    viewer.dummyLocalStream = undefined;
  }
};
