import RtspServer, { Mount, Mounts } from "../src";

const server = new RtspServer({
  rtpPortCount: 10000,
  rtpPortStart: 10000,

  clientPort: 6554,
  clientServerHooks: {
    // authentication: authHook,
    checkMount,
    clientClose,
  },

  publishServerHooks: {
    authentication: authHook,
    checkMount,
  },
  serverPort: 5554,
});

async function run(): Promise<void> {
  try {
    // server.Mounts.getMount("rtsp://172.20.10.7:5554/web/app/trackID=1");
    await server.start();
  } catch (e) {
    console.error(e);
  }
}

async function authHook(username: string, password: string): Promise<boolean> {
  // if (username === "test" && password === "test") return true;
  // console.log("authHook");
  return true;
}

async function checkMount(req: any): Promise<boolean> {
  const url = new URL(req.uri);
  if (url.pathname === "/web/app") {
    console.log("CheckMount");

    return true;
  }

  return false;
}

async function clientClose(mount: Mount): Promise<void> {
  console.log(mount.streams);
}

run();
