const core = require("@actions/core");
const exec = require("./exec");

const pid = core.getState("pid");

const post = (pid) => {
  try {
    exec(`sudo kill ${pid} || true`);
  } catch (error) {
    core.warning(`Error stopping OpenVPN: ${error.message}`);
  }
};

if (!pid) {
  core.setFailed("No OpenVPN PID found");
} else {
  try {
    post(pid);
  } catch (error) {
    core.setFailed(error.message);
  }
}
