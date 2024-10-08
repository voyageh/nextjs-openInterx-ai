'use client'

import { Tooltip, IconButton } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
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
              light: <DarkModeIcon />,
              dark: <LightModeIcon />,
            }[calculatedMode]}
      </IconButton>
    </Tooltip>
  )
}
