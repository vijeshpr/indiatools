import type { ChequeFormData, ChequeErrors } from './types.ts'

export function validateChequeForm(data: ChequeFormData): { isValid: boolean; errors: ChequeErrors } {
  const errors: ChequeErrors = {}

  // 1. Payee Name
  const trimmedPayee = data.payeeName.trim()
  if (!trimmedPayee) {
    errors.payeeName = 'Please enter payee name or select "SELF"'
  } else if (trimmedPayee.length < 2) {
    errors.payeeName = 'Payee name must be at least 2 characters'
  } else if (trimmedPayee.length > 70) {
    errors.payeeName = 'Payee name cannot exceed 70 characters'
  }

  // 2. Amount in Rupees
  const numAmount = typeof data.amountRupees === 'string' ? parseFloat(data.amountRupees) : data.amountRupees
  if (isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'Please enter a valid rupee amount greater than ₹0'
  } else if (numAmount > 1000000000) {
    errors.amount = 'Amount exceeds maximum supported preview limit of ₹100 Crores'
  }

  // 3. Date
  if (!data.date) {
    errors.date = 'Please enter the cheque date'
  } else {
    const parts = data.date.split('-')
    if (parts.length !== 3) {
      errors.date = 'Invalid date format (use YYYY-MM-DD)'
    } else {
      const parsedDate = new Date(data.date)
      if (isNaN(parsedDate.getTime())) {
        errors.date = 'Invalid calendar date'
      }
    }
  }

  const isValid = Object.keys(errors).length === 0
  return { isValid, errors }
}
