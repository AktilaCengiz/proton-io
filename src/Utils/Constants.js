const CommandHandlerEvents = {
    COΜMAND_NOT_FOUND: "commandNotFound",
    COMMAND_START: "commandStarted",
    COMMAND_END: "commandFinished",
    ERROR: "error"
};
const CommandRunnerEvents = {
    COMMAND_NOT_EXECUTABLE: "commandNotExecutable",
    MISSING_PERMISSIONS: "missingPermissions",
    COOLDOWN: "cooldown",
    ERROR_AFTER_COMMAND_RUN: "errorAfterCommandRun"
};

module.exports = {
    CommandHandlerEvents,
    CommandRunnerEvents
};
