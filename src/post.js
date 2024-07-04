const core = require("@actions/core");
const exec = require("./exec");

const post = (pid) => {
  if (!pid) {
    core.warning("No OpenVPN PID found");
    return;
  }

  try {
    exec(`sudo kill ${pid} || true`);
  } catch (error) {
    core.warning(`Error stopping OpenVPN: ${error.message}`);
  }
};

module.exports = post;
