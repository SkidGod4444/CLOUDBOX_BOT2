const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const axios = require("axios");

// Hindi jokes
const jokes = [
    "Why was the math book sad? Because it had too many problems.",
    "What do you call a fake noodle? An Impasta.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "Parallel lines have so much in common. It’s a shame they’ll never meet.",
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "What did one ocean say to the other ocean? Nothing, they just waved.",
    "Why don’t scientists trust atoms? Because they make up everything.",
    "What did one hat say to the other? You stay here, I’ll go on ahead.",
    "How do you organize a space party? You planet.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "What do you get when you cross a snowman with a vampire? Frostbite.",
    "How does a penguin build its house? Igloos it together.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "What do you call a bear with no teeth? A gummy bear.",
    "What did one toilet say to the other toilet? You look flushed.",
    "What did the grape say when it got stepped on? Nothing, it just let out a little wine.",
    "Why did the scarecrow get promoted? Because he was outstanding in his field.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "What do you get when you cross a snowman with a vampire? Frostbite.",
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "Why don’t scientists trust atoms? Because they make up everything.",
    "What did one ocean say to the other ocean? Nothing, they just waved.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "What did one hat say to the other? You stay here, I’ll go on ahead.",
    "How do you organize a space party? You planet.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "What did the buffalo say when his son left? Bison.",
    "Why couldn't the leopard play hide and seek? Because he was always spotted.",
    "What’s orange and sounds like a parrot? A carrot.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "What do you call a pig that does karate? A pork chop.",
    "What do you call fake spaghetti? An impasta.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "What do you call a bear with no teeth? A gummy bear.",
    "Why did the scarecrow get promoted? Because he was outstanding in his field.",
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you get when you cross a snowman and a vampire? Frostbite!",
    "How do you organize a space party? You planet!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the mushroom go to the party? Because he was a fungi!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "How does a penguin build its house? Igloos it together!",
    "What do you call a man with a rubber toe? Roberto!",
    "Why couldn't the bicycle stand up by itself? It was two tired!",
    "What do you call a fat psychic? A four-chin teller!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What did one ocean say to the other ocean? Nothing, they just waved!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "Why was the math book sad? Because it had too many problems!",
    "What's orange and sounds like a parrot? A carrot!",
    "What's a pirate's favorite letter? You think it's R, but it be the C!",
    "What do you get when you cross a snowman with a vampire? Frostbite!",
    "What do you call a pile of cats? A meowtain!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fake noodle? An impasta!",
    "What do you call a fish with no eyes? Fsh!",
    "How does a penguin build its house? Igloos it together!",
    "What did one hat say to the other hat? You stay here, I'll go on ahead!",
    "What do you call a bear with no teeth? A gummy bear!",
    "What do you call a shoe made of a banana? A slipper!",
    "What do you get when you cross a snowman and a vampire? Frostbite!",
    "What do you call a guy lying on your doorstep? Matt!",
    "Why couldn't the bicycle stand up by itself? It was two tired!",
    "What did the pirate say on his 80th birthday? Aye Matey!",
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "How do you organize a space party? You planet!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "What did one hat say to the other hat? You stay here, I'll go on ahead!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "Why couldn't the leopard play hide and seek? Because he was always spotted!",
    "What’s orange and sounds like a parrot? A carrot!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What did one ocean say to the other ocean? Nothing, they just waved!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "What did one hat say to the other hat? You stay here, I'll go on ahead!",
    "How do you organize a space party? You planet!",
    "What do you call a man with a rubber toe? Roberto!",
    "Why couldn't the bicycle stand up by itself? It was two tired!",
    "What do you get when you cross a snowman with a vampire? Frostbite!",
    "What do you call a fake noodle? An impasta!",
    "What did one hat say to the other? You stay here, I’ll go on ahead.",
    "What’s orange and sounds like a parrot? A carrot.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "What do you get when you cross a snowman with a vampire? Frostbite.",
    "Why don’t scientists trust atoms? Because they make up everything.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "What did one hat say to the other? You stay here, I’ll go on ahead.",
    "How do you organize a space party? You planet.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the buffalo say when his son left? Bison.",
    "Why couldn't the leopard play hide and seek? Because he was always spotted.",
    "What’s orange and sounds like a parrot? A carrot.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "What do you call a pig that does karate? A pork chop.",
    "What do you call fake spaghetti? An impasta.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "What do you call a bear with no teeth? A gummy bear.",
    "Why did the scarecrow get promoted? Because he was outstanding in his field.",
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you get when you cross a snowman and a vampire? Frostbite!",
    "How do you organize a space party? You planet!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the mushroom go to the party? Because he was a fungi!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "How does a penguin build its house? Igloos it together!",
    "What do you call a man with a rubber toe? Roberto!",
    "Why couldn't the bicycle stand up by itself? It was two tired!",
    "What do you call a fat psychic? A four-chin teller!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What did one ocean say to the other ocean? Nothing, they just waved!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "Why was the math book sad? Because it had too many problems!",
    "What's orange and sounds like a parrot? A carrot!",
    "What's a pirate's favorite letter? You think it's R, but it be the C!",
    "What do you get when you cross a snowman with a vampire? Frostbite!",
    "What do you call a pile of cats? A meowtain!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fake noodle? An impasta!",
    "What do you call a fish with no eyes? Fsh!",
    "How does a penguin build its house? Igloos it together!",
    "What did one hat say to the other hat? You stay here, I'll go on ahead!",
    "What do you call a bear with no teeth? A gummy bear!",
    "What do you call a shoe made of a banana? A slipper!",
    "What do you get when you cross a snowman and a vampire? Frostbite!",
    "What do you call a guy lying on your doorstep? Matt!",
    "Why couldn't the bicycle stand up by itself? It was two tired!",
    "What did the pirate say on his 80th birthday? Aye Matey!",
    "SUBSCRIBE MY MASTERS YT CHANNEL: https://www.youtube.com/channel/UC5pAe0zPiPCtFSZn5NwSvmg"

];

// Function to send a random message
function sendRandomMessage(chatId, userInput) {
    const randomNumber = Math.random();
    if (randomNumber < 2) {
        // Send a random joke
        const randomIndex = Math.floor(Math.random() * jokes.length);
        const randomJoke = jokes[randomIndex];
        bot.sendMessage(chatId, randomJoke);
    } else {
        // Send the user input as it is
        bot.sendMessage(chatId, userInput);
    }
}

app.get("/", (req, res) => {
    res.send("Bot is alive");
});

const port = 3339;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// replace the value below with the Telegram token you receive from @BotFather
const token =  process.env.BOT;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;
    const msg_id = msg.message_id;

    // Send a random message
    bot.sendMessage(chatId, chatId, {
        reply_to_message_id: msg_id,
    });
});

module.exports = app;
