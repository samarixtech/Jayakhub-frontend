import React from 'react';
import { Cookie } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LegalPageTemplate from '../../../common/public-website/LegalPageTemplate';

export default function Cookies() {
    const t = useTranslations('Cookies');

    const sections = [
        {
            id: 'what-are-cookies',
            title: t('sections.what_are_cookies.title'),
            content: t('sections.what_are_cookies.content'),
        },
        {
            id: 'how-we-use-cookies',
            title: t('sections.how_we_use_cookies.title'),
            content: t('sections.how_we_use_cookies.content'),
        },
        {
            id: 'your-choices',
            title: t('sections.your_choices.title'),
            content: t('sections.your_choices.content'),
        },
    ];

    return (
        <LegalPageTemplate
            pageTitle={t('header.title')}
            lastUpdated={t('header.last_updated')}
            icon={Cookie}
            alertText={t('alert')}
            sections={sections}
            breadcrumbsText={t('header.breadcrumbs')}
            tocTitle={t('sidebar.toc')}
            needAssistanceText={t('sidebar.need_assistance')}
            contactSupportText={t('sidebar.contact_support')}
        />
    );
}
