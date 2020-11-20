// |||||||||||||||||||||||
// Restart Command
// Proton-io Copyright
// |||||||||||||||||||||||
const restart = require("../Other/restart")

module.exports = {
    name: "restart",
    aliases: ["restart"],
    description: "restart komutu",
    usage: "restart",
    ownerOnly: true,
    run: async (message,args,client) => {

        message.channel.send("Bot yeniden başlatılıyor..").then(() => {
            restart();
        })    
}}
