import { Icon } from '@/components/icon'
import { NavItem, ThemeSwitch, UserSetting } from '@/components/root'
import './layout.scss'

export default function RootLayout({ children }) {
  return (
    <div className="openinterx-ai">
      <div className="openinterx-ai__left hidden-sm-and-down">
        <div className="logo">
          <Icon name="Logo" className="logo-icon" />
        </div>
        <div className="menu-wrapper">
          <NavItem href="/my-video" label="My video">
            <Icon name="MyVideo" className="menu-icon" />
          </NavItem>
          <NavItem href="/sample-video" label="Sample video">
            <Icon name="SampleVideo" className="menu-icon" />
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
