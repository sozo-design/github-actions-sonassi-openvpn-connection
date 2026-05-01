import * as core from "@actions/core";
import exec from "./exec.js";

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
