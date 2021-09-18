//|||||||||||||||||||||||
// Eval command
//|||||||||||||||||||||||

module.exports = {
  name: "eval",
  aliases: ["eval"],
  description: "Eval komutu",
  usage: "eval <kod bloğu>",
  ownerOnly: true,
  run: async (message,args,client) => {
    try {
      const code = args.join(" ");

      if(!code) return message.channel.send("Lütfen denenecek bir kod yazınız.")
      let evaled = eval(code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
      message.channel.send(evaled, {code:"xl"});
    } catch (err) {
      message.channel.send(`\`Statik bir hata oluştu:\` \`\`\`xl\n${err}\n\`\`\``);
    }
 
}}
  