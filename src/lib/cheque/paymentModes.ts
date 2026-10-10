import type { PaymentMode, PaymentModeInfo, SupportedLanguage } from './types.ts'
import { getTranslations } from './languages.ts'

export function getPaymentModes(langCode: SupportedLanguage = 'en'): PaymentModeInfo[] {
  const t = getTranslations(langCode)

  return [
    {
      id: 'account-payee',
      title: t.modeAccountPayeeTitle,
      badge: 'Highest Security',
      safetyLevel: 'high',
      description: t.modeAccountPayeeDesc,
      educationalNote: t.modeAccountPayeeEdu,
      chequeMarking: 'A/C PAYEE ONLY',
    },
    {
      id: 'cash',
      title: t.modeCashTitle,
      badge: 'Over Counter',
      safetyLevel: 'medium',
      description: t.modeCashDesc,
      educationalNote: t.modeCashEdu,
      chequeMarking: 'OPEN / CASH',
    },
    {
      id: 'self',
      title: t.modeSelfTitle,
      badge: 'Personal Cash',
      safetyLevel: 'high',
      description: t.modeSelfDesc,
      educationalNote: t.modeSelfEdu,
      chequeMarking: 'SELF WITHDRAWAL',
    },
    {
      id: 'bearer',
      title: t.modeBearerTitle,
      badge: 'High Loss Risk',
      safetyLevel: 'low',
      description: t.modeBearerDesc,
      educationalNote: t.modeBearerEdu,
      chequeMarking: 'OR BEARER',
    },
  ]
}

export function getPaymentModeInfo(mode: PaymentMode, langCode: SupportedLanguage = 'en'): PaymentModeInfo {
  const modes = getPaymentModes(langCode)
  return modes.find((m) => m.id === mode) || modes[0]
}
