// |||||||||||||||||||||||
// ping command
// |||||||||||||||||||||||
module.exports = {
    name: "ping",
    aliases: ["ping"],
    description: "ping komutu",
    usage: "ping <kod bloğu>",
    ownerOnly: false,
    run: async (message,args,client) => {
             
         var holdMessage = " *Ping ölçülüyor..*"
         var holdMessage2 = " *Ping ölçülüyor...* "
         var pingMessage = ':ping_pong: | **'+ Math.round(client.ws.ping) +'ms** olarak ölçüldü.'
    
         message.channel.send(holdMessage).then(msg => {
             setTimeout(() => {
                msg.edit(holdMessage2)
             }, 1000);
             setTimeout(() => {
                msg.edit(pingMessage)
             }, 3000)
         })
     
}}
    