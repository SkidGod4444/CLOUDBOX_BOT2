/**
 * CREDITS: https://l.devwtf.in/cloudboxbot2
 */

const TOKEN = ENV_TOKEN; // Get it from @BotFather https://core.telegram.org/bots#6-botfather
const WEBHOOK = "/endpoint";
const SECRET = ENV_SECRET; // A-Z, a-z, 0-9, _ and -

/**
 * Wait for requests to the worker
 */
addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event));
  } else if (url.pathname === "/registerWebhook") {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET));
  } else if (url.pathname === "/unRegisterWebhook") {
    event.respondWith(unRegisterWebhook(event));
  } else {
    event.respondWith(new Response("No handler for this request"));
  }
});

/**
 * Handle requests to WEBHOOK
 * https://core.telegram.org/bots/api#update
 */
async function handleWebhook(event) {
  // Check secret
  if (event.request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== SECRET) {
    return new Response("Unauthorized", { status: 403 });
  }

  // Read request body synchronously
  const update = await event.request.json();
  // Deal with response asynchronously
  event.waitUntil(onUpdate(update));

  return new Response("Ok");
}

/**
 * Handle incoming Update
 * supports messages and callback queries (inline button presses)
 * https://core.telegram.org/bots/api#update
 */
async function onUpdate(update) {
  if ("message" in update) {
    await onMessage(update.message);
  }
  if ("callback_query" in update) {
    await onCallbackQuery(update.callback_query);
  }
}

/**
 * Set webhook to this worker's url
 * https://core.telegram.org/bots/api#setwebhook
 */
async function registerWebhook(event, requestUrl, suffix, secret) {
  // https://core.telegram.org/bots/api#setwebhook
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`;
  const r = await (
    await fetch(apiUrl("setWebhook", { url: webhookUrl, secret_token: secret }))
  ).json();
  return new Response("ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2));
}

/**
 * Remove webhook
 * https://core.telegram.org/bots/api#setwebhook
 */
async function unRegisterWebhook(event) {
  const r = await (await fetch(apiUrl("setWebhook", { url: "" }))).json();
  return new Response("ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2));
}

/**
 * Return url to telegram api, optionally with parameters added
 */
function apiUrl(methodName, params = null) {
  let query = "";
  if (params) {
    query = "?" + new URLSearchParams(params).toString();
  }
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`;
}

/**
 * Send plain text message
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendPlainText(chatId, text) {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        text,
      })
    )
  ).json();
}

/**
 * Send text message formatted with MarkdownV2-style
 * Keep in mind that any markdown characters _*[]()~`>#+-=|{}.! that
 * are not part of your formatting must be escaped. Incorrectly escaped
 * messages will not be sent. See escapeMarkdown()
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendMarkdownV2Text(chatId, text) {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
      })
    )
  ).json();
}

/**
 * Escape string for use in MarkdownV2-style text
 * if `except` is provided, it should be a string of characters to not escape
 * https://core.telegram.org/bots/api#markdownv2-style
 */
function escapeMarkdown(str, except = "") {
  const all = "_*[]()~`>#+-=|{}.!\\"
    .split("")
    .filter((c) => !except.includes(c));
  const regExSpecial = "^$*+?.()|{}[]\\";
  const regEx = new RegExp(
    "[" +
      all.map((c) => (regExSpecial.includes(c) ? "\\" + c : c)).join("") +
      "]",
    "gim"
  );
  return str.replace(regEx, "\\$&");
}

/**
 * Send a message with a single button
 * `button` must be an button-object like `{ text: 'Button', callback_data: 'data'}`
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButton(chatId, text, button) {
  return sendInlineButtonRow(chatId, text, [button]);
}

/**
 * Send a message with buttons, `buttonRow` must be an array of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButtonRow(chatId, text, buttonRow) {
  return sendInlineButtons(chatId, text, [buttonRow]);
}

/**
 * Send a message with buttons, `buttons` must be an array of arrays of button objects
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendInlineButtons(chatId, text, buttons) {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        reply_markup: JSON.stringify({
          inline_keyboard: buttons,
        }),
        text,
        parse_mode: "MarkdownV2",
      })
    )
  ).json();
}

/**
 * Answer callback query (inline button press)
 * This stops the loading indicator on the button and optionally shows a message
 * https://core.telegram.org/bots/api#answercallbackquery
 */
async function answerCallbackQuery(callbackQueryId, text = null) {
  const data = {
    callback_query_id: callbackQueryId,
  };
  if (text) {
    data.text = text;
  }
  return (await fetch(apiUrl("answerCallbackQuery", data))).json();
}

/**
 * Handle incoming callback_query (inline button press)
 * https://core.telegram.org/bots/api#message
 */
async function onCallbackQuery(callbackQuery) {
  if (callbackQuery.data === "back_to_main") {
    await sendHelpMessage(callbackQuery.message.chat.id);
  } else {
    await sendMarkdownV2Text(
      callbackQuery.message.chat.id,
      escapeMarkdown(`You pressed the button with data=\`${callbackQuery.data}\``, '`')
    );
  }
  return answerCallbackQuery(callbackQuery.id, "Button press acknowledged!");
}

/**
 * Handle incoming Message
 * https://core.telegram.org/bots/api#message
 */
async function onMessage(message) {
  try {
    if (message.text.startsWith("/start") || message.text.startsWith("/help")) {
      return await sendHelpMessage(message.chat.id);
    } else if (message.text.startsWith("/support")) {
      return await sendSupportButtons(message.chat.id);
    } else if (message.text.startsWith("/contact")) {
      return await sendContactButtons(message.chat.id);
    } else if (message.text.startsWith("/verify")) {
      return await verifyCode(message.chat.id, message);
    } else if (message.text.startsWith("/source")) {
      return await sendSourceButtons(message.chat.id);
    } else {
      return await sendMarkdownV2Text(
        message.chat.id,
        escapeMarkdown(`*Sorry command not found:* \`${message.text}\`\nUse /help to see available commands.`, '*`')
      );
    }
  } catch (error) {
    console.error("Error in onMessage:", error);
    return sendMarkdownV2Text(
      message.chat.id,
      escapeMarkdown("Sorry, an error occurred while processing your message.")
    );
  }
}

async function sendHelpMessage(chatId) {
  return await sendMarkdownV2Text(
    chatId,
    escapeMarkdown(
      "*Welcome to CLOUDBOX!* 🚀\n\n" +
      "I'm here to assist you with various tasks. Here's what I can do:\n\n" +
      "`/help` - This message.\n" +
      "/support - Join our support server for more help.\n" +
      "/contact - Sends owners contact details.\n" +
      "/verify - Verify your token.\n" +
      "/source - Sends the source code.\n",
      '*`'
    )
  );
}

async function verifyCode(chatId, message) {
  const parts = message.text.split(' ');
  if (parts.length !== 2) {
    return await sendMarkdownV2Text(chatId, escapeMarkdown("Please use the format: `/verify <code>`", '`'));
  }

  const code = parts[1].trim();
  if (!/^\d+$/.test(code)) {
    return await sendMarkdownV2Text(chatId, escapeMarkdown("The verification code should contain only numeric characters."));
  }

  await sendInlineButtons(
    chatId,
    escapeMarkdown(`Verified: ${code}, Now you can use our web app.`),
    [
      [
        {
          text: "Open Web App",
          url: "https://cloud-box.devwtf.in/",
        },
        {
          text: "Back to Menu",
          callback_data: "back_to_main",
        },
      ],
    ]
  );
}

function sendSupportButtons(chatId) {
  return sendInlineButtonRow(
    chatId,
    escapeMarkdown("🚀 Welcome to the awesome CLOUDBOX community! 🌟"),
    [
      {
        text: "Join community",
        url: "https://t.me/cloudbox_storage",
      },
      {
        text: "Back to Menu",
        callback_data: "back_to_main",
      },
    ]
  );
}

function sendSourceButtons(chatId) {
  return sendInlineButtons(
    chatId,
    escapeMarkdown("Explore our source code repositories, please give a star on github:"),
    [
      [
        {
          text: "CLOUDBOX_BOT",
          url: "https://l.devwtf.in/cloudboxbot",
        },
        {
          text: "CLOUDBOX_BOT2",
          url: "https://l.devwtf.in/cloudboxbot2",
        },
      ],
      [
        {
          text: "CLOUDBOX_WEB",
          url: "https://git.new/PkJdogB",
        },
        {
          text: "CLOUDBOX_API",
          url: "https://l.devwtf.in/cloudboxapi",
        },
      ],
    ]
  );
}

function sendContactButtons(chatId) {
  return sendInlineButtons(
    chatId,
    escapeMarkdown("Contact the owner Saidev Dhal or explore our social media:"),
    [
      [
        {
          text: "TWITTER",
          url: "https://dub.sh/saidev-twitter",
        },
        {
          text: "LINKEDIN",
          url: "https://dub.sh/saidev-linkedin",
        },
      ],
      [
        {
          text: "INSTAGRAM",
          url: "https://dub.sh/saidev-instagram",
        },
        {
          text: "YOUTUBE",
          url: "https://dub.sh/skidgod",
        },
      ],
    ]
  );
}
