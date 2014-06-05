#Cards Against Humanity IRC bot

IRC bot that let's you play [Cards Against Humanity](http://www.cardsagainsthumanity.com/) in IRC. The game is running in IRCnet on #cah, but you can just as easily run your own instance on your own channel for more private games.

##Commands
* **!start** - Start a new game.
* **!stop** - Stop the currently running game.
* **!pause** - Pause the currently running game.
* **!resume** - Resume a paused game.
* **!join** - Join to the currently running game.
* **!quit** - Quit from the game.
* **!cards** - Show the cards you have in your hand.
* **!play # (#)** - Play a card from your hand, # being the number of the card in the list. Play as many numbers separated by spaces as the current card required.
* **!winner #** - Pick a winner of the round, # being the number of the entry in the list. Only for the current *card czar*.
* **!points** - Show players' *awesome points* in the current game.
* **!list** - List players in the current game.
* **!status** - Show current status of the game. Output depends on the state of the game (e.g. when waiting for players to play, you can check who hasn't played yet)

Some of these commands reply as notice. If you use [Irssi](http://www.irssi.org), you can use [active_notice.pl](http://scripts.irssi.org/scripts/active_notice.pl) to get notices on the active window instead of status window.

##Install
1. Clone the repository.
2. Edit configuration files with your channel & server settings.
3. Install dependencies using `npm install`.

###Requirements
* Node.js 0.10.*

##Run
Run the bot by running `node app.js`, or if you want to run it with production settings instead of development, run `NODE_ENV=production node app.js`.

##Configuration
Main configuration files are located in `config/env`. There are two files by default for two different environments, development and production (e.g. if you want to test the bot on a separate channel). For the `clientOptions` directive, refer to the [Node-IRC documentation](https://node-irc.readthedocs.org/en/latest/API.html#client).

###Cards
Card configuration is located in `config/cards` directory. There are 2 files by default, `blacks.json` and `whites.json`, that contain the default cards of the game. You can add your custom cards to the game by creating two new files in the directory, `blacks-custom.json` and `whites-custom.json`, and adding cards in them using the same format as the default card files. Any card you add to these files will also be automatically loaded to the game during start up.

Black cards are what players draw from the deck to their hands, white cards are the "question cards". Yes, this is the opposite of the original Cards Against Humanity. No, it wasn't done intentionally, but that's the way it is now.

###Notify Users
Users currently in the channel with the bot can be notified when a game begins by setting the `notifyUsers` directive to true. Users with ~ and & modes are not notified.

###Set Topic
The bot can be configured to set the channel topic indicating whether a game is running or not by setting the `setTopic` directive to true. The `topicBase` directive will be appended to the end of the status information. The bot must have permission in the channel for this to work.

##TODO
* Save game & player data to MongoDB for all time top scores & other statistics.
* Move some of the America specific cards to separate MURICA-deck, that can be enabled/disabled from config for non-american players.
* Config options for rule variations, such as voting the best instead of card czar choosing the winner.
* The haiku round.

##Contribute
All contributions are welcome in any form, be it pull requests for new features and bug fixes or issue reports or anything else.

It is recommended to use the **develop** branch as a starting point for new features.

##Thanks
Special thanks to everyone on the ***super awesome secret IRC channel*** that have helped me test this and given feedback during development.

##License
Cards Against Humanity IRC bot and its source code is licensed under a [Creative Commons BY-NC-SA 2.0 license](http://creativecommons.org/licenses/by-nc-sa/2.0/).
