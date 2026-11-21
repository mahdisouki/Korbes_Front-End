import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QrMark } from './DemoNote.tsx'

export function VoucherActions({ number }: { number: string }) {
  const { t } = useTranslation()
  const [notice, setNotice] = useState<'pdf' | 'resend' | ''>('')

  return (
    <div className="mt-5">
      <QrMark seed={number} />
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">{t('shop.qrNote')}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-turquoise px-5 py-2.5 text-sm font-medium text-white transition hover:bg-turquoise-deep"
          onClick={() => setNotice('pdf')}
        >
          {t('shop.downloadPdf')}
        </button>
        <button
          type="button"
          className="rounded-full bg-aqua px-5 py-2.5 text-sm font-medium text-med transition hover:bg-aqua/70"
          onClick={() => setNotice('resend')}
        >
          {t('shop.resend')}
        </button>
      </div>
      {notice ? (
        <p role="status" className="mt-4 text-sm leading-relaxed text-med">
          {notice === 'pdf' ? t('shop.pdfNotice') : t('shop.resendNotice')}
        </p>
      ) : null}
    </div>
  )
}
