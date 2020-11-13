//#############
// ProtonModule for TheFunt, Duck and every Discord bot!
// This module is created by Venosa Studio.
// This module throught easy module handler 
// All rights reserved.
// Copyright (C) Venosa Studio 2020
// Copyright (C) Aktila Cengiz.
//#############

//################################# 
// Dependencies
const { Collection } = require("discord.js")
const fs = require('fs')
const chalk = require("chalk")
//################################# 


// ##############
//Error Messages
const errorTitle = chalk.red("@ | Proton Hata! : ")
const exampleTitle = chalk.blue("@  | Örnek: ")
const holdMessage = chalk.red("@ | Bot başlatılıyor.. \n Copyright (C) Proton!")
const commandLoadedMessage = chalk.yellow("@ | Komut yüklendi: ")
// ##############

module.exports = class {
    constructor(client,komutKlasör,eventLoad, ownerID, options) {
        options = options || {yardımKomutu: false} //eğer yardım komutu belirtilmemişse otomatik yoksay.
        if (!client) throw new ReferenceError(errorTitle + "Lütfen geçerli bir client beliritiniz.")
        if (!komutKlasör) throw new ReferenceError(errorTitle + "Lütfen komut klasörünüzü belirtiniz.")
        if (!ownerID) throw new ReferenceError(errorTitle + "Lütfen bir bot sahibi ID'si belirtiniz.")

        //######
        // Some import 
        this.client= client;
        this.client.komutKlasor = komutKlasör
        this.komutKlasör = komutKlasör
        this.ownerID =  ownerID
        //######

        //########
        // eventLoader
        //########
       fs.readdir(`${process.cwd()}/${eventLoad}`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          const event = require(`${process.cwd()}/${eventLoad}/${file}`);
          let eventName = file.split(".")[0];
          client.on(eventName, event.bind(null, client));
        });
      });

        //########
        // command Handler
        //########
        
        //############
        // if(ready?) go on!
        console.log(holdMessage)
       //############
        client.commands=new Collection()
        client.aliases=new Map()
        var commandFiles = fs
        .readdirSync(`${process.cwd()}/${komutKlasör}`)
        .filter(file => file.endsWith('.js'));
      for (var file of commandFiles) {
        var command = require(`${process.cwd()}/${komutKlasör}/${file}`);
        console.log(commandLoadedMessage + chalk.green(command.name))
        client.commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
      }

if(options.owner) {

    var commandFiles2 = fs
    .readdirSync(`${process.cwd()}/node_modules/proton-io/ownerCommands`)
    .filter(file3 =>file3.endsWith('.js'));
    
    for (var file3 of commandFiles2) {
        var ownerCommands = require(`${process.cwd()}/node_modules/proton-io/ownerCommands/${file3}`)
    
    client.commands.set(ownerCommands.name,ownerCommands)
    if (ownerCommands.aliases && Array.isArray(ownerCommands.aliases)) ownerCommands.aliases.forEach(alias => client.aliases.set(alias, ownerCommands.name));
}
}

if(options.defaultCommands) {

  var commandFiles3 = fs
  .readdirSync(`${process.cwd()}/node_modules/proton-io/defaultCommands`)
  .filter(file0 =>file0.endsWith('.js'));
  
  for (var file0 of commandFiles3) {
      var defaultCommands = require(`${process.cwd()}/node_modules/proton-io/defaultCommands/${file0}`)
  
  client.commands.set(defaultCommands.name,defaultCommands)
  if (defaultCommands.aliases && Array.isArray(defaultCommands.aliases)) defaultCommands.aliases.forEach(alias => client.aliases.set(alias, defaultCommands.name));
}
}
}
    message(msg,prefix="!",options) {
        options = options || {botlaraCevapVer: false,etiketiPrefixOlarakKullan: true,etiketlePrefixOgren: true}
        if (!msg) throw new ReferenceError(" Error ..")
        if (!options.botlaraCevapVer) {
            if (msg.author.bot) return;
        }
        let p=prefix
        if (options.etiketlePrefixOgren) {
            if (msg.content === `<@!${this.client.user.id}>`) return msg.channel.send(`Bu sunucudaki prefixim: **${p}**`)
        }
        if (options.etiketiPrefixOlarakKullan) {
            if (msg.content.startsWith(`<@!${this.client.user.id}>`)) p=`<@!${this.client.user.id}>`
       }
       if (msg.webhookID || msg.channel.type === "dm" || !msg.content || !msg.channel.guild) return;
        if (!msg.content.startsWith(p)) return;
        const commandName = msg.content.slice(p.length).trim().split(' ')[0]
        const args = msg.content.slice(p.length).trim().split(' ').slice(1)
        const command = this.client.commands.get(commandName)
          || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        if (!command) {
            return;
        };
        if (command.ownerOnly) {

          if(this.ownerID[1] == undefined) {
            if ((this.ownerID[0]) !== msg.author.id) {
              return msg.reply("Bu komutu yalnızca `bot geliştiricileri` kullanabilir!")
            } else {
              try {
                command.run(msg,args,this.client)
            } catch (e) {
                console.log(e)
                msg.channel.send(`Bir hata oluştu. Lütfen **${commandName}** komutunda hata olduğunu sahiplerime bildiriniz.`)
            }
              
            }
          } else if(this.ownerID[1] !== undefined) {
            if(this.ownerID[0] == msg.author.id || this.ownerID[1] == msg.author.id) {
           
              try {
                command.run(msg,args,this.client)
            } catch (e) {
                console.log(e)
                msg.channel.send(`Bir hata oluştu. Lütfen **${commandName}** komutunda hata olduğunu sahiplerime bildiriniz.`)
            }
              
            } else {
              return msg.reply("Bu komutu yalnızca `bot geliştiricileri` kullanabilir!")
  
            }   
          } 
        }
   
    }
}
//################################# 
// Everything start with end.
// - Aktila Cengiz
//################################# 