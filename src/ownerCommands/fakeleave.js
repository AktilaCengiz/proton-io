// |||||||||||||||||||||||
// fakeleave Command
// Proton-io Copyright
// |||||||||||||||||||||||
module.exports = {
  name: "fakeleave",
  aliases: ["fakeleave","fakeayrıl"],
  description: "fakeleave komutu",
  usage: "fakeleave <komut ismi>",
  ownerOnly: true,
  run: async (message,args,client) => {

    client.emit("guildMemberRemove",message.member)

    message.channel.send("İşlem başarılı.")
}}
