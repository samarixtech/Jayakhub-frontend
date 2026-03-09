import React from 'react';
import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LegalPageTemplate from '../../../common/public-website/LegalPageTemplate';

export default function PrivacyPolicy() {
    const t = useTranslations('Privacy');

    const sections = [
        {
            id: 'info-collection',
            title: t('sections.info_collection.title'),
            content: t('sections.info_collection.content'),
        },
        {
            id: 'use-info',
            title: t('sections.use_info.title'),
            content: t('sections.use_info.content'),
        },
        {
            id: 'sharing',
            title: t('sections.sharing.title'),
            content: t('sections.sharing.content'),
        },
        {
            id: 'data-retention',
            title: t('sections.data_retention.title'),
            content: t('sections.data_retention.content'),
        },
    ];

    return (
        <LegalPageTemplate
            pageTitle={t('header.title')}
            lastUpdated={t('header.last_updated')}
            icon={Shield}
            alertText={t('alert')}
            sections={sections}
            breadcrumbsText={t('header.breadcrumbs')}
            tocTitle={t('sidebar.toc')}
            needAssistanceText={t('sidebar.need_assistance')}
            contactSupportText={t('sidebar.contact_support')}
        />
    );
}
