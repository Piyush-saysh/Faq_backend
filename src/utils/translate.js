import { translate } from '@vitalets/google-translate-api';

const SUPPORTED_LANGUAGES = ['hi', 'en'];

export default async function createTranslations(inputBody) {
    const translations = {};

    for (const lang of SUPPORTED_LANGUAGES) {
        try {
            // await new Promise((resolve) => setTimeout(resolve, 500));
            const { text } = await translate(inputBody.question, { to: lang });
            const { text: translatedAnswer } = await translate(
                inputBody.answer,
                {
                    to: lang,
                },
            );

            translations[lang] = {
                question: text,
                answer: translatedAnswer,
            };
        } catch (error) {
            if (error.name === 'TooManyRequestsError') {
                console.error('Rate limit reached.');
                break;
            }

            console.error(`Failed to translate to ${lang}: `, error);
            continue;
        }
    }

    return translations;
}
