import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, apiBlob, apiJson, saveBlob } from '../../lib/api.ts'

export function VoucherActions({
  voucherId,
  publicId,
}: {
  voucherId: string
  publicId: string
}) {
  const { t } = useTranslation()
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const download = async () => {
    setBusy(true)
    setNotice('')
    try {
      const blob = await apiBlob(`/vouchers/issued/${voucherId}/pdf`)
      saveBlob(blob, `${publicId}.pdf`)
    } catch (err) {
      setNotice(err instanceof ApiError && err.code === 'pdf_not_ready' ? t('shop.pdfMissing') : t('shop.errors.order'))
    } finally {
      setBusy(false)
    }
  }

  const resend = async () => {
    setBusy(true)
    setNotice('')
    try {
      await apiJson(`/me/vouchers/${voucherId}/resend`, { method: 'POST' })
      setNotice(t('shop.resendQueued'))
    } catch {
      setNotice(t('shop.errors.order'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          className="rounded-full bg-turquoise px-5 py-2.5 text-sm font-medium text-white transition hover:bg-turquoise-deep disabled:opacity-60"
          onClick={() => {
            void download()
          }}
        >
          {t('shop.downloadPdf')}
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded-full bg-aqua px-5 py-2.5 text-sm font-medium text-med transition hover:bg-aqua/70 disabled:opacity-60"
          onClick={() => {
            void resend()
          }}
        >
          {t('shop.resend')}
        </button>
      </div>
      {notice ? (
        <p role="status" className="mt-4 text-sm leading-relaxed text-med">
          {notice}
        </p>
      ) : null}
    </div>
  )
}
