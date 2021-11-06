import { CommandHandler, ProtonClient } from "../";


class Client extends ProtonClient {
    commandHandler: CommandHandler;
    constructor() {
        super({
            owners: [],
            intents: []
        });

        this.commandHandler = new CommandHandler(this, {
            directory: ""
        });
    }
}


const client = new Client();
