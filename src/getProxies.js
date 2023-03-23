import axios from "axios";
import fs from "fs";

const setProxies = async () => {
  const { data } = await axios.get(
    "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all"
  );

  // create a file with the proxies
  const proxies = {
    createdAt: new Date().toISOString(),
    proxies: data.split("\r\n"),
  };

  fs.writeFileSync("proxies.txt", JSON.stringify(proxies));
  return proxies;
};

const getProxies = async () => {
  // check if the file exists and checkedAt is less than 24 hours ago
  if (!fs.existsSync("proxies.txt")) {
    await setProxies();
  }

  const proxies = fs.readFileSync("proxies.txt", "utf8") ?? {};
  let { createdAt } = proxies;

  createdAt = new Date(createdAt);
  const now = new Date();

  const diff = now - createdAt;
  const hours = diff / 1000 / 60 / 60;

  if (hours < 24) {
    return proxies;
  }

  // if not, create it
  return await setProxies();
};

export { getProxies };
