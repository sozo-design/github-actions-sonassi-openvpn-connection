import fs from "fs";
import * as core from "@actions/core";
import exec from "./exec.js";
import tail from "tail";

const { Tail } = tail;

/*global clearTimeout, setTimeout*/
/*eslint no-undef: "error"*/

const run = (callback) => {
  const tmpDir = core.getInput("tmp_dir", { required: true });
  const configFile = core.getInput("config_file", { required: true });
  const configFileName = "config.ovpn";
  const certificate = core.getInput("certificate", { required: true });
  const certificateName = core.getInput("certificate_name", { required: true });
  const openVpnLog = "openvpn.log";
  const configFilePath = `${tmpDir}/${configFileName}`;
  const certificateFilePath = `${tmpDir}/${certificateName}`;
  const logFilePath = `${openVpnLog}`;

  // If the certificate is base64 encoded, decode it and write it to a temporary file
  core.debug(`Writing config file to ${configFilePath}`);
  exec(`echo "${configFile}" > ${configFilePath}`);

  core.debug(`Checking if config file exists: ${configFilePath}`);
  if (!fs.existsSync(configFilePath)) {
    throw new Error(`Config file not found: ${configFilePath}`);
  }

  // If the certificate is base64 encoded, decode it and write it to a temporary file
  core.debug(`Writing certificate file to ${certificateFilePath}`);
  exec(`echo "${certificate}" | base64 -d > ${certificateFilePath}`);

  core.debug(`Checking if certificate file exists: ${certificateFilePath}`);
  if (!fs.existsSync(`${certificateFilePath}`)) {
    throw new Error(`Config file not found: ${certificateFilePath}`);
  }

  core.debug(`Appending to config file: ${configFilePath}`);
  fs.appendFileSync(configFilePath, "\n# -- GHA Modified --\n");

  core.debug(`Checking if log file exists: ${logFilePath}`);
  if (!fs.existsSync(`${logFilePath}`)) {
    core.debug(`Creating log file: ${logFilePath}`);
    fs.writeFileSync(logFilePath, "");
  }

  core.debug(`Watching log file: ${logFilePath}`);
  const tailInstance = new Tail(logFilePath);

  try {
    core.debug(`Starting OpenVPN with config: ${configFilePath}`);
    exec(
      `sudo openvpn --config ${configFilePath} --pkcs12 ${certificateFilePath} --daemon --log ${logFilePath} --writepid openvpn.pid`,
    );
  } catch (error) {
    core.error(`Error starting OpenVPN: ${error.message}`);
    throw error;
  }

  tailInstance.on("line", (line) => {
    core.debug(line);
    if (line.includes("Peer Connection Initiated with")) {
      tailInstance.unwatch();
      clearTimeout(timer);
      const pid = fs.readFileSync("openvpn.pid", "utf8").trim();
      core.info(`OpenVPN connected successfully with PID ${pid}`);
      core.info(`Sleeping for 5 seconds to allow connection to stabilize`);
      exec(`sleep 5`);
      callback(pid);
    }
  });

  const timer = setTimeout(() => {
    core.setFailed("OpenVPN failed to start within 15 seconds");
    tailInstance.unwatch();
  }, 15000);
};

export default run;
