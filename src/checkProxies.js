import axios from "axios";
import fs from "fs";

const checkProxy = async (proxy, checkAgainst) => {
  proxy = proxy.split(":");

  const [ip, port, username, password] = proxy;

  if (!ip || !port) {
    return;
  }

  try {
    console.log(`Checking ${ip}:${port}...`);

    const { data } = await axios(checkAgainst, {
      timeout: 4000,
      proxy: {
        host: ip,
        port,
        auth: {
          username,
          password,
        },
      },
    });

    return {
      ip,
      port,
    };
  } catch (error) {
    console.log(`Error checking ${ip}:${port}`);
    return false;
  }
};

export { checkProxy };
