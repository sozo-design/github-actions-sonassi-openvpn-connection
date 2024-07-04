const shelljsExec = require("shelljs.exec");
const core = require("@actions/core");

const exec = (command) => {
  core.info(`Executing ${command}`);
  const result = shelljsExec(command);
  core.debug(JSON.stringify(result));
  if (result.code !== 0) {
    core.warning(result.stdout);
    throw new Error(
      `Command failed with exit code ${result.code}: ${result.stderr}`,
    );
  }
  core.info(result.stdout);
};

module.exports = exec;
