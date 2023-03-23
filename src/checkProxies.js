import axios from "axios";
import fs from "fs";

const checkProxy = async (proxy, checkAgainst) => {
  proxy = proxy.split(":");

  const [ip, port] = proxy;

  if (!ip || !port) {
    return;
  }

  try {
    console.log(`Checking ${ip}:${port}...`);
    const { data } = await axios(checkAgainst, {
      timeout: 3000,
      proxy: {
        host: ip,
        port,
      },
    });
    return {
      ip,
      port,
    };
  } catch (error) {
    return false;
  }
};

export { checkProxy };
