import * as core from "@actions/core";
import main from "./main.js";

try {
  main((pid) => {
    core.saveState("pid", pid);
  });
} catch (error) {
  core.setFailed(error.message);
}
