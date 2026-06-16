
import { getRequestConfig, GetRequestConfigParams } from 'next-intl/server';

type SupportedLocale = 'en' | 'it' | 'fr' | 'es' | 'pt' | 'zh' | 'ja' | 'ar' | 'ru';

export default getRequestConfig(async (params: GetRequestConfigParams) => {
    const { locale } = params;

    const supportedLocales: SupportedLocale[] = ['en', 'it', 'fr', 'es', 'pt', 'zh', 'ja', 'ar', 'ru'];
    const activeLocale: SupportedLocale =
        locale && supportedLocales.includes(locale as SupportedLocale)
            ? (locale as SupportedLocale)
            : 'en';


    const messages = (await import(`../components/messages/${activeLocale}.json`)).default;

    return {
        locale: activeLocale,
        messages
    };
});