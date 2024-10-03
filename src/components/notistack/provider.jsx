'use client'

import { SnackbarProvider } from 'notistack'

export default function Provider() {
  return <SnackbarProvider autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} />
}
