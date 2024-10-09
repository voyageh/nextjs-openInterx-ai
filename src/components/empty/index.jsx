import EmptyIcon from '@/assets/images/empty.svg'

import './index.scss'

export default function Empty({ describe }) {
  const EmptyDes = describe || 'No data'
  return (
    <div className="empty-wrapper">
      <div className="empty-icon">
        <EmptyIcon />
      </div>
      <div className="empty-description">{EmptyDes}</div>
    </div>
  )
}
