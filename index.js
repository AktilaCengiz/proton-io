/* eslint-disable global-require */

/*
  Copyright 2021 Venosa Studio

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
  to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
  and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = {
    ProtonClient: require("./src/Structures/ProtonClient"),
    ProtonHandler: require("./src/Structures/ProtonHandler"),
    ProtonModule: require("./src/Structures/ProtonModule"),
    CommandHandler: require("./src/Structures/Commands/CommandHandler"),
    ListenerHandler: require("./src/Structures/Listeners/ListenerHandler"),
    Command: require("./src/Structures/Commands/Command"),
    Listener: require("./src/Structures/Listeners/Listener"),
    MongooseProvider: require("./src/Structures/DatabaseProviders/MongooseProvider"),
    Utils: {
        readdir: require("./src/Utils/readdir")
    }
};

// nothing goes as planned in this cursed world...
// Venosa 19.09.2021
