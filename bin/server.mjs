#!/usr/bin/env node --experimental-modules

import "localenv";
import yargs from "yargs";

import log from "book";
import Debug from "debug";

import CreateServer from "../server.js";

const debug = Debug("quicknexus");

const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 --port [num]")
  .config()
  .options("secure", {
    default: false,
    describe: "use this flag to indicate proxy over https",
  })
  .options("allow-delete", {
    default: false,
    describe:
      "use this flag to create endpoint that allows users to delete clients that may be accidentally open",
  })
  .options("port", {
    default: "80",
    describe: "listen on this port for outside requests",
  })
  .options("address", {
    default: "0.0.0.0",
    describe: "IP address to bind to",
  })
  .options("domain", {
    describe:
      "Specify the base domain name. This is optional if hosting quicknexus from a regular example.com domain. This is required if hosting a quicknexus from a subdomain (i.e. tunnel.domain.tld where clients will be client-app.tunnel.domain.tld)",
  })
  .options("lower-port-limit", {
    default: 40000,
    describe: "Lower limit for the range of ports to give out",
  })
  .options("upper-port-limit", {
    default: 50000,
    describe: "Upper limit for the range of ports to give out",
  })
  .options("max-sockets", {
    default: 10,
    describe:
      "maximum number of tcp sockets each client is allowed to establish at one time (the tunnels)",
  }).argv;

if (argv.help) {
  yargs.showHelp();
  process.exit();
}

const server = CreateServer({
  max_tcp_sockets: argv["max-sockets"],
  secure: argv.secure,
  domain: argv.domain,
  lowerPortLimit: argv["lower-port-limit"],
  upperPortLimit: argv["upper-port-limit"],
  allowDelete: argv["allow-delete"],
});

server.listen(argv.port, argv.address, () => {
  debug("server listening on port: %d", server.address().port);
});

process.on("SIGINT", () => {
  process.exit();
});

process.on("SIGTERM", () => {
  process.exit();
});

process.on("uncaughtException", (err) => {
  log.error(err);
});

process.on("unhandledRejection", (reason, _) => {
  log.error(reason);
});

// vim: ft=javascript
