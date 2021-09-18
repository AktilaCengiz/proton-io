// |||||||||||||||||||||||
// Load Command
// Proton-io Copyright
// |||||||||||||||||||||||
module.exports = {
  name: "load",
  aliases: ["load"],
  description: "load komutu",
  usage: "load <komut ismi>",
  ownerOnly: true,
  run: async (message,args,client) => {

    const komutKlasör = client.komutKlasor
     
        if(!args[0]) {
            return message.channel.send("Lütfen bir komut ismi yazınız.")
          }
            
          let command = args[0];
          
          message.channel.send(`**${command}** adlı komut yükleniyor...`)
              .then(m => {
                try {
                  const newCommand = require(`${process.cwd()}/${komutKlasör}/${command}.js`);
                  message.client.commands.set(newCommand.name, newCommand);
                } catch (error) {
                  console.log(error);
                  message.channel.send(`Komut güncellenirken bir hata oluştu: \`${command}\`:\n\`${error.message}\``);
                }
                  m.edit(` **${command}** adlı komut yüklendi.`);
              });
          }}