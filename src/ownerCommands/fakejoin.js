// |||||||||||||||||||||||
// fakejoin Command
// Proton-io Copyright
// |||||||||||||||||||||||
module.exports = {
  name: "fakejoin",
  aliases: ["fakejoin","fakekatıl"],
  description: "fakejoin komutu",
  usage: "fakejoin <komut ismi>",
  ownerOnly: true,
  run: async (message,args,client) => {

    client.emit("guildMemberAdd",message.member)

    message.channel.send("İşlem başarılı.")
}}
