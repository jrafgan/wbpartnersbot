const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmerRu; // Например, используем стеммер для русского языка

function findAnswerByKeywords(question, answers) {
    // Разделение вопроса на отдельные слова
    const tokens = tokenizer.tokenize(question);

    // Лемматизация слов в вопросе
    const lemmatizedWords = tokens.map(word => stemmer.stem(word));

    // Поиск ответа в базе данных
    let foundAnswer = null;
    answers.forEach(answer => {
        const answerWords = tokenizer.tokenize(answer);

        // Лемматизация слов в ответе
        const lemmatizedAnswerWords = answerWords.map(word => stemmer.stem(word));

        // Проверка наличия всех лемматизированных слов в ответе
        const allWordsPresent = lemmatizedWords.every(word => lemmatizedAnswerWords.includes(word));
        if (allWordsPresent) {
            foundAnswer = answer;
        }
    });

    return foundAnswer;
}

module.exports = { findAnswerByKeywords };

