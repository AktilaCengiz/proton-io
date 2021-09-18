// |||||||||||||||||||||||
// fakejoin Command
// Proton-io Copyright
// |||||||||||||||||||||||
module.exports = {
  name: "fakejoin-bot",
  aliases: ["fakejoinbot","fakekatıl-bot"],
  description: "fakejoin komutu",
  usage: "fakejoin <komut ismi>",
  ownerOnly: true,
  run: async (message,args,client) => {

    client.emit("guildMemberAdd",message.guild.members.cache.get(client.user.id))

    message.channel.send("İşlem başarılı.")
}}
