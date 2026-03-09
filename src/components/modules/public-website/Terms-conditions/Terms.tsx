import React from 'react';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LegalPageTemplate from '../../../common/public-website/LegalPageTemplate';

export default function Terms() {
    const t = useTranslations('Terms');

    const sections = [
        {
            id: 'contractual-relationship',
            title: t('sections.contractual_relationship.title'),
            content: t('sections.contractual_relationship.content'),
        },
        {
            id: 'the-services',
            title: t('sections.the_services.title'),
            content: t('sections.the_services.content'),
        },
        {
            id: 'use-of-services',
            title: t('sections.use_of_services.title'),
            content: t('sections.use_of_services.content'),
        },
        {
            id: 'payment',
            title: t('sections.payment.title'),
            content: t('sections.payment.content'),
        },
    ];

    return (
        <LegalPageTemplate
            pageTitle={t('header.title')}
            lastUpdated={t('header.last_updated')}
            icon={FileText}
            alertText={t('alert')}
            sections={sections}
            breadcrumbsText={t('header.breadcrumbs')}
            tocTitle={t('sidebar.toc')}
            needAssistanceText={t('sidebar.need_assistance')}
            contactSupportText={t('sidebar.contact_support')}
        />
    );
}
