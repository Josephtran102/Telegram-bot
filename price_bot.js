import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';

// Replace 'YOUR_API_KEY' with your actual CoinMarketCap API Key
const apiKey = 'YOUR_API_KEY';

// Function to fetch cryptocurrency prices from CoinMarketCap API
async function fetchCryptoPrices(symbol) {
    try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error);
        throw error;
    }
}

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram Bot Token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Handle /help command to display help information
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const message = `Đây là menu trợ giúp:
    /price [symbol] - Xem giá của một loại token`;
    bot.sendMessage(chatId, message);
});

// Handle /price command with symbol parameter
bot.onText(/\/price (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const symbol = match[1].toUpperCase(); // Extract cryptocurrency symbol from the command and convert to uppercase

    try {
        const data = await fetchCryptoPrices(symbol);
        const cryptoData = data.data[symbol];

        if (cryptoData && cryptoData.quote && cryptoData.quote.USD) {
            const price = parseFloat(cryptoData.quote.USD.price).toFixed(4); // Limit to 4 decimal places
            bot.sendMessage(chatId, `${symbol}: $${price}`);
            console.log(`${symbol}: $${price}`); // Log to console with limited decimal places
        } else {
            bot.sendMessage(chatId, `Không tìm thấy thông tin về giá của token ${symbol}.`);
        }
    } catch (error) {
        console.error('Lỗi khi lấy giá từ CoinMarketCap:', error);
        bot.sendMessage(chatId, 'Đã có lỗi xảy ra khi lấy giá. Vui lòng thử lại sau.');
    }
});


console.log("Bot actived");
