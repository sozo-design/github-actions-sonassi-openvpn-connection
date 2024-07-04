const core = require("@actions/core");
const main = require("./main");
const post = require("./post");

// Detect the current running mode
const isPost = core.getState("isPost");

if (isPost) {
  // If it's in post mode, then clean up the environment
  const pid = core.getState("pid");
  try {
    post(pid);
  } catch (error) {
    core.setFailed(error.message);
  }
} else {
  // If it's in pre mode, then run the main function
  try {
    main((pid) => {
      core.saveState("pid", pid);
    });
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    core.saveState("isPost", true);
  }
}
