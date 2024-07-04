const fs = require("fs");
const core = require("@actions/core");
const exec = require(".exec");
const Tail = require("tail").Tail;

/*global clearTimeout, setTimeout*/
/*eslint no-undef: "error"*/

const run = (callback) => {
  const configFile = core.getInput("config_file", { required: true });
  const configFileName = '/tmp/config.ovpn'
  const certificate = core.getInput("certificate", { required: true });
  const certificateName = core.getInput("certificate_name", { required: true });

  // If the certificate is base64 encoded, decode it and write it to a temporary file
  exec(`echo "${configFile}" > ${configFileName}`);

  if (!fs.existsSync(configFileName)) {
    throw new Error(`Config file not found: ${configFileName}`);
  }

  // If the certificate is base64 encoded, decode it and write it to a temporary file
  exec(`echo "${certificate}" | base64 -d > /tmp/${certificateName}`);

  if (!fs.existsSync(`/tmp/${certificateName}`)) {
    throw new Error(`Config file not found: /tmp/${certificateName}`);
  }

  fs.appendFileSync(configFile, "\n# -- GHA Modified --\n");

  fs.writeFileSync("/tmp/openvpn.log", "");
  const tail = new Tail("/tmp/openvpn.log");

  try {
    exec(
      `sudo openvpn --config ${configFileName} --pkcs12 /tmp/${certificateName} --daemon --log /tmp/openvpn.log --writepid openvpn.pid`,
    );
  } catch (error) {
    core.error(`Error starting OpenVPN: ${error.message}`);
    throw error;
  }

  tail.on("line", (line) => {
    core.info(line);
    if (line.includes("Initialization Sequence Completed")) {
      core.info("OpenVPN started successfully");
      tail.unwatch();
      clearTimeout(timer);
      const pid = fs.readFileSync("openvpn.pid", "utf8").trim();
      core.info(`OpenVPN connected successfully with PID ${pid}`);
      callback(pid);
    }
  });

  const timer = setTimeout(() => {
    core.setFailed("OpenVPN failed to start within 30 seconds");
  }, 30000);
};

module.exports = run;
