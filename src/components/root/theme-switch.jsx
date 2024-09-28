'use client'

import { Tooltip, IconButton } from '@mui/material'
import IconSvg from '@/components/icon/index2'
import { useColorScheme } from '@mui/material/styles'

export default function ThemeSwitch() {
  const { mode, systemMode, setMode } = useColorScheme()
  const calculatedMode = mode === 'system' ? systemMode : mode

  return (
    <Tooltip title={calculatedMode === 'dark' ? 'Turn on the light' : 'Turn off the light'} placement="right" arrow>
      <IconButton
        disableTouchRipple
        disabled={!calculatedMode}
        onClick={() => {
          const newMode = calculatedMode === 'dark' ? 'light' : 'dark'
          setMode(newMode)
        }}
      >
        {!calculatedMode
          ? null
          : {
              light: <IconSvg name="root/dark" />,
              dark: <IconSvg name="root/light" />,
            }[calculatedMode]}
      </IconButton>
    </Tooltip>
  )
}
