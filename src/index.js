const core = require("@actions/core");
const main = require("./main");

try {
  main((pid) => {
    core.saveState("pid", pid);
  });
} catch (error) {
  core.setFailed(error.message);
}
