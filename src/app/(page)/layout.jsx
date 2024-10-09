import Logo from '@/assets/images/logo.svg'
import MyVideo from '@/assets/images/my-video.svg'
import SampleVideo from '@/assets/images/sample-video.svg'

import { NavItem, ThemeSwitch, UserSetting } from '@/components/root'
import './layout.scss'

export default function RootLayout({ children }) {
  return (
    <div className="openinterx-ai">
      <div className="openinterx-ai__left hidden-sm-and-down">
        <div className="logo">
          <Logo className="logo-icon" />
        </div>
        <div className="menu-wrapper">
          <NavItem href="/my-video" title="My video">
            <MyVideo className="menu-icon" />
          </NavItem>
          <NavItem href="/sample-video" title="Sample video">
            <SampleVideo className="menu-icon" />
          </NavItem>
        </div>
        <div className="user-avatar">
          <ThemeSwitch />
          <UserSetting />
        </div>
      </div>
      <div className="openinterx-ai__right">{children}</div>
    </div>
  )
}
