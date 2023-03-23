import path from "path";
import { checkProxy } from "./src/checkProxies.js";
import { getProxies } from "./src/getProxies.js";
import fs from "fs";

(async () => {
  // check if workingProxies.json exists
  // if it does, check if checkedAt is less than 24 hours ago
  // if it is, return the file
  // if it isn't, continue
  // if it doesn't, continue

  if (fs.existsSync("workingProxies.json")) {
    let proxies = fs.readFileSync("workingProxies.json", "utf8") ?? {};
    proxies = JSON.parse(proxies);
    let { checkedAt } = proxies;

    checkedAt = new Date(checkedAt);
    const now = new Date();

    const diff = now - checkedAt;
    const hours = diff / 1000 / 60 / 60;

    if (hours < 24)
      return console.log("already checked proxies in the last 24 hours");
  } else {
    const proxies = await getProxies();
    const { proxies: proxyList } = proxies;

    const checkAgainst = "https://google.com";

    const checkedProxies = await Promise.all(
      proxyList.map(async (proxy) => {
        const checked = await checkProxy(proxy, checkAgainst);
        return checked;
      })
    );

    const workingProxies = checkedProxies.filter((proxy) => proxy);

    if (!workingProxies.length) {
      console.log("No working proxies found");
      return;
    }

    // set the working proxies to the file
    const proxiesToWrite = {
      checkedAt: new Date().toISOString(),
      proxies: workingProxies.map((proxy) => ({
        ip: proxy.ip,
        port: proxy?.port,
      })),
    };

    const json = JSON.stringify(proxiesToWrite, null, 2);
    fs.writeFileSync("workingProxies.json", json, "utf8");
    // delete the proxies.txt file
    fs.unlinkSync("proxies.txt");
  }
})();
