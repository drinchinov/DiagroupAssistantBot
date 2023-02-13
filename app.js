const { Telegraf } = require('telegraf');
require('dotenv').config();
const fs = require('fs');

const filePath = "answers.json";

const bot = new Telegraf(process.env.API_KEY);

//bot.help((ctx) => ctx.reply('Чтобы зарегистрировать новый ключ и значение Введите < /add ключ ; значение \n Если ключ новый, то он запишет его в свой словарь и будет на него откликаться, в противном случае даст знать'));

bot.command('add', async (ctx) => {

    let content = fs.readFileSync(filePath, "utf8");
    let answers = JSON.parse(content);
    let answer;

    let {text} = ctx.update.message;

    if (text.includes(';'))
    {
            let textParse = text.match(/[^\/add\b]/g).join('').split(';');

        textParse.forEach((e, i) => {
            textParse[i] = e.trim();
        });

        let checkDouble = answers.find(obj => obj.key == textParse[0]);

        //console.log(!checkDouble);
        if (!checkDouble) {

            const id = Math.max(...answers.map(obj => obj.id)) + 1;

            Number.isFinite(id) ? answer = {id : id, key : textParse[0], value : textParse[1]} : facepalm = {id: 1, key : textParse[0], value : textParse[1]};
            answers.push(answer);
            fs.writeFileSync(filePath, JSON.stringify(answers));
            await ctx.telegram.sendMessage(ctx.update.message.chat.id, `Команда выполнена. Ключевое слово *${textParse[0]}* внесен в словарь!`);

        } else {
            await ctx.telegram.sendMessage(ctx.update.message.chat.id, `Команда не выполнена. Ключевое слово *${textParse[0]}* уже есть!`);
        }
    } else {
        await ctx.telegram.sendMessage(ctx.update.message.chat.id, 'Нету разделителя ";". Регистрируйте команду с разделителем!');
    }

    
  });

bot.on('text', async (ctx) => {
    let {text} = ctx.update.message;

    let content = fs.readFileSync(filePath, "utf8");
    let answers = JSON.parse(content);

    answers.forEach(async element => {
        let regex = new RegExp(`${element.key}`, 'i');
        if (regex.test(text)){
            await ctx.telegram.sendMessage(ctx.update.message.chat.id, `${element.value}`);
        }
    });
});



bot.launch();