import { hri } from "human-readable-ids";
import Debug from "debug";

import Client from "./Client.js";
import TunnelAgent from "./TunnelAgent.js";

// Manage sets of clients
//
// A client is a "user session" established to service a remote quickportal
class ClientManager {
  constructor(opt) {
    this.opt = opt;

    // id -> client instance
    this.clients = new Map();

    // constants
    this.lowerPortLimit = this.opt.lowerPortLimit;
    this.upperPortLimit = this.opt.upperPortLimit;

    // statistics
    this.stats = {
      portsEngaged: [],
      idsUsed: [],
    };

    this.debug = Debug("quin:ClientManager");

    // This is totally wrong :facepalm: this needs to be per-client...
    this.graceTimeout = null;
  }

  // create a new tunnel with `id`
  // if the id is already used, a random id is assigned
  // if the tunnel could not be created, throws an error
  async newClient(id) {
    const clients = this.clients;
    const stats = this.stats;
    const lpl = this.lowerPortLimit;
    const upl = this.upperPortLimit;

    // can't ask for id already is use
    if (clients[id]) {
      id = hri.random();
    }

    // check if enough ports are available
    if (upl - lpl === stats.portsEngaged.length) {
      throw new Error("tunnels limit reached, please try again later");
    }

    // get a free port within the supplied range
    const port = randomInRangeWithExclude(lpl, upl, stats.portsEngaged);

    const maxSockets = this.opt.max_tcp_sockets;

    const agent = new TunnelAgent({
      clientId: id,
      maxSockets: 10,
      port: port,
    });

    const client = new Client({
      id,
      agent,
      port,
    });

    // add to stats immediately
    // to avoiding races with other
    // clients requesting same id
    clients[id] = client;
    stats.idsUsed.push(id);
    stats.portsEngaged.push(port);

    client.once("close", () => {
      this.removeClient(id);
    });

    // try/catch used here to remove client id
    try {
      await agent.listen();
      return {
        id: id,
        port: port,
        max_conn_count: maxSockets,
      };
    } catch (err) {
      this.removeClient(id);
      // rethrow error for upstream to handle
      throw err;
    }
  }

  removeClient(id) {
    this.debug("removing client: %s", id);
    const client = this.clients[id];
    if (!client) {
      return;
    }

    this.stats.portsEngaged = removeItemOnce(
      this.stats.portsEngaged,
      this.clients[id].port
    );
    this.stats.idsUsed = removeItemOnce(this.stats.idsUsed, id);
    delete this.clients[id];

    client.close();
  }

  hasClient(id) {
    return !!this.clients[id];
  }

  getClient(id) {
    return this.clients[id];
  }
}

function removeItemOnce(arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function randomInRangeWithExclude(min, max, exclude = []) {
  // a really clever solution from this Stack Overflow answer: https://stackoverflow.com/a/64910550
  let num = Math.floor(Math.random() * (max - min - exclude.length) + min);

  exclude
    .slice()
    .sort((a, b) => a - b)
    .every((e) => e <= num && (num++, true));

  return num;
}

export default ClientManager;
