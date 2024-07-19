const fs = require("fs");
const core = require("@actions/core");
const exec = require("./exec");
const Tail = require("tail").Tail;

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
  exec(`echo "${configFile}" > ${configFilePath}`);

  if (!fs.existsSync(configFilePath)) {
    throw new Error(`Config file not found: ${configFilePath}`);
  }

  // If the certificate is base64 encoded, decode it and write it to a temporary file
  exec(`echo "${certificate}" | base64 -d > ${certificateFilePath}`);

  if (!fs.existsSync(`${certificateFilePath}`)) {
    throw new Error(`Config file not found: ${certificateFilePath}`);
  }

  fs.appendFileSync(configFile, "\n# -- GHA Modified --\n");

  fs.writeFileSync(openVpnLog, "");
  const tail = new Tail(openVpnLog);

  try {
    exec(
      `sudo openvpn --config ${configFilePath} --pkcs12 ${certificateFilePath} --daemon --log ${logFilePath} --writepid openvpn.pid`,
    );
  } catch (error) {
    core.error(`Error starting OpenVPN: ${error.message}`);
    throw error;
  }

  tail.on("line", (line) => {
    core.debug(line);
    if (line.includes("Peer Connection Initiated with")) {
      tail.unwatch();
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
    tail.unwatch();
  }, 15000);
};

module.exports = run;
