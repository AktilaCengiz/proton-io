// |||||||||||||||||||||||
// Reload Command
// Proton-io Copyright
// |||||||||||||||||||||||
module.exports = {
  name: "reload",
  aliases: ["reload"],
  description: "reload komutu",
  usage: "reload <komut ismi>",
  ownerOnly: true,
  run: async (message,args,client) => {

    const komutKlasör = client.komutKlasor

    if(!args[0]) {
            return message.channel.send("Lütfen bir komut ismi yazınız.")
          }
            
          let command;
          if (client.commands.has(args[0])) {
            command = args[0];
          } else if (client.aliases.has(args[0])) {
            command = client.aliases.get(args[0]);
          }
          if (!command) {
            return message.channel.send(`**${command}** adlı bir komut bulunamadı.`)
          } else {
            message.channel.send(`**${command}** adlı komut güncelleniyor..`)
              .then(m => {
                delete require.cache[require.resolve(`${process.cwd()}/${komutKlasör}/${command}.js`)]
                try {
                  const newCommand = require(`${process.cwd()}/${komutKlasör}/${command}.js`);
                  message.client.commands.set(newCommand.name, newCommand);
                } catch (error) {
                  console.log(error);
                  message.channel.send(`Komut güncellenirken bir hata oluştu: \`${command}\`:\n\`${error.message}\``);
                }
                  m.edit(` **${command}** adlı komut güncellendi.`);
              });
          }
  }}