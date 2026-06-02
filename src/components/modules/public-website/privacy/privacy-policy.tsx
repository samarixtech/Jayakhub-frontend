"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('LegalPolicies');
  const [activeTab, setActiveTab] = useState('privacy');

  const TABS = [
    { id: 'privacy', label: t('tabs.privacy') },
    { id: 'terms', label: t('tabs.terms') },
    { id: 'refund', label: t('tabs.refund') },
    { id: 'delivery', label: t('tabs.delivery') },
    { id: 'deletion', label: t('tabs.deletion') },
  ];

  const sectionList = (items: string[]) => (
    <ul className="list-disc pl-5 mb-6 text-[15px] leading-relaxed text-[#1a1a1a] space-y-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-[#F2F2ED] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Alert Banner */}
        <div className="bg-[#FFF8E1] border border-[#FFB300] rounded-lg p-4 mb-8 flex gap-3 shadow-sm">
          <span className="text-[#F57C00] font-bold">⚠️</span>
          <p className="text-sm text-[#5D4037] leading-relaxed">
            <strong>{t('alert.title')}</strong> {t('alert.description')}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#e5e0d8] mb-8 overflow-x-auto no-scrollbar">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-[#FF6B35] text-[#FF6B35]'
                      : 'border-transparent text-[#6b6b6b] hover:text-[#1B3A57] hover:border-[#1B3A57]'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[16px] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#e5e0d8]">
          {activeTab === 'privacy' && (
            <>
              <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">{t('privacy.title')}</h1>
              <p className="text-sm text-[#6b6b6b] mb-6">{t('privacy.effective_date')}</p>
              <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t('privacy.intro')}</p>
              {['s1','s2','s3','s4','s5','s6','s7','s8','s9'].map((s) => (
                <div key={s}>
                  <h2 className="text-lg font-bold text-[#1B3A57] mb-3">{t(`privacy.sections.${s}.title`)}</h2>
                  {['s1','s2'].includes(s) ? (
                    sectionList(t.raw(`privacy.sections.${s}.items`))
                  ) : (
                    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`privacy.sections.${s}.content`)}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {activeTab === 'terms' && (
            <>
              <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">{t('terms.title')}</h1>
              <p className="text-sm text-[#6b6b6b] mb-6">{t('terms.effective_date')}</p>
              <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t('terms.intro')}</p>
              {['s1','s2','s3','s4','s5','s6','s7'].map((s) => (
                <div key={s}>
                  <h2 className="text-lg font-bold text-[#1B3A57] mb-3">{t(`terms.sections.${s}.title`)}</h2>
                  {['s1','s2','s3'].includes(s) ? (
                    sectionList(t.raw(`terms.sections.${s}.items`))
                  ) : (
                    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`terms.sections.${s}.content`)}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {activeTab === 'refund' && (
            <>
              <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">{t('refund.title')}</h1>
              <p className="text-sm text-[#6b6b6b] mb-6">{t('refund.effective_date')}</p>
              {['s1','s2','s3','s4'].map((s) => (
                <div key={s}>
                  <h2 className="text-lg font-bold text-[#1B3A57] mb-3">{t(`refund.sections.${s}.title`)}</h2>
                  <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`refund.sections.${s}.content`)}</p>
                </div>
              ))}
              <h2 className="text-lg font-bold text-[#1B3A57] mb-3">{t('refund.sections.s5.title')}</h2>
              {sectionList(t.raw('refund.sections.s5.items'))}
              <p className="text-[15px] leading-relaxed text-[#1a1a1a]">{t('refund.sections.s5.contact')}</p>
            </>
          )}

          {activeTab === 'delivery' && (
            <>
              <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">{t('delivery_policy.title')}</h1>
              <p className="text-sm text-[#6b6b6b] mb-6">{t('delivery_policy.effective_date')}</p>
              {['s1','s2','s3','s4'].map((s) => (
                <div key={s}>
                  <h2 className="text-lg font-bold text-[#1B3A57] mb-3">{t(`delivery_policy.sections.${s}.title`)}</h2>
                  <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`delivery_policy.sections.${s}.content`)}</p>
                </div>
              ))}
            </>
          )}

          {activeTab === 'deletion' && (
            <>
              <h1 className="text-[28px] font-bold text-[#1B3A57] mb-2">{t('deletion.title')}</h1>
              <p className="text-sm text-[#6b6b6b] mb-6">{t('deletion.effective_date')}</p>
              <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t('deletion.intro')}</p>
              {['s1','s2','s3','s4','s5'].map((s) => (
                <div key={s}>
                  <h2 className="text-lg font-bold text-[#1B3A57] mb-3">{t(`deletion.sections.${s}.title`)}</h2>
                  {s === 's4' ? (
                    sectionList(t.raw('deletion.sections.s4.items'))
                  ) : (
                    <p className="text-[15px] leading-relaxed text-[#1a1a1a] mb-6">{t(`deletion.sections.${s}.content`)}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
