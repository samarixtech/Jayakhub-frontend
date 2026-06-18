"use client";

import { useTranslations } from "next-intl";
import { C } from "./constants";

export function CompareTable() {
  const t = useTranslations('RestaurantDelivery.compare');
  const headers = t.raw('headers') as string[];
  const rows = t.raw('rows') as { name: string; commission?: string; subscription?: string; own?: boolean; branded?: boolean; kurdish?: boolean | null; jayak?: boolean }[];

  return (
    <section id="compare" className="py-[90px] px-8 scroll-mt-20" style={{ background: C.cream }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[13px] font-semibold tracking-[0.15em] uppercase mb-[14px]" style={{ color: C.orange }}>{t('badge')}</span>
          <h2 className="font-bold tracking-[-0.02em] mb-[18px]" style={{ fontSize: "clamp(30px,4vw,46px)", color: C.navy }}>{t('title')}</h2>
          <p className="text-[18px] leading-[1.65] max-w-[680px] mx-auto" style={{ color: C.muted }}>{t('subtitle')}</p>
        </div>
        <div className="rounded-[18px] overflow-hidden border" style={{ background: C.white, borderColor: C.line, boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 800 }}>
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-[22px] py-[18px] text-left text-[13px] font-semibold tracking-[0.06em] uppercase" style={{ background: C.navy, color: C.white }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.name}
                    className="transition-colors"
                    style={
                      r.jayak
                        ? { background: "linear-gradient(90deg,rgba(11,93,78,.08),rgba(11,93,78,.04))" }
                        : undefined
                    }
                  >
                    <td className="px-[22px] py-[18px] font-bold border-b" style={{ borderColor: C.line, color: r.jayak ? C.green : C.ink, fontSize: r.jayak ? 17 : 15 }}>
                      {r.jayak && <span className="inline-block w-3 h-3 rounded-full mr-2.5 shrink-0" style={{ background: C.orange, boxShadow: `0 0 0 4px rgba(11,93,78,.2)` }} />}
                      {r.name}
                    </td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b" style={{ borderColor: C.line }}>
                      {r.commission ? (
                        <span className="inline-block px-[10px] py-1 rounded-[6px] text-[13px] font-semibold" style={{ background: "rgba(198,40,40,.1)", color: C.red }}>{r.commission}</span>
                      ) : (
                        <span className="inline-block px-[10px] py-1 rounded-[6px] text-[13px] font-semibold" style={{ background: "rgba(11,93,78,.12)", color: C.green }}>{t('zero_commission')}</span>
                      )}
                    </td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b" style={{ borderColor: C.line }}>{r.subscription || "$0"}</td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b font-semibold" style={{ borderColor: C.line, color: r.own ? C.green : C.red }}>{r.own ? t('yes') : t('no')}</td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b font-semibold" style={{ borderColor: C.line, color: r.branded ? C.green : C.red }}>{r.branded ? t('yes') : t('no')}</td>
                    <td className="px-[22px] py-[18px] text-[15px] border-b font-semibold" style={{ borderColor: C.line, color: r.kurdish === true ? C.green : r.kurdish === false ? C.red : C.muted }}>
                      {r.kurdish === true ? (r.jayak ? t('kurdish_yes') : t('yes')) : r.kurdish === false ? t('no') : t('limited')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-[22px] py-[18px] text-[13px] leading-[1.6] border-t" style={{ background: C.creamWarm, color: C.muted, borderColor: C.line }}>
            {t.rich('source_notes', { strong: (chunks) => <strong style={{ color: C.ink }}>{chunks}</strong> })}
          </div>
        </div>

      </div>
    </section>
  );
}
