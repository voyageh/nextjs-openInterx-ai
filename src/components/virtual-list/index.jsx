import { useEffect, useRef, memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import EmptyIcon from '@/assets/images/empty.svg'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { useVirtualizer } from '@tanstack/react-virtual'

import './index.scss'

const VirtualList = (props) => {
  const { data = [], size = 1, loading, estimateSize, wrapper, rowClass, itemContent, loader, empty } = props
  const rootRef = useRef(null)
  const viewportRef = useRef(null)

  const [initialize] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        autoHide: 'leave',
        autoHideDelay: 200,
      },
    },
  })

  useEffect(() => {
    const { current: root } = rootRef
    const { current: viewport } = viewportRef

    if (root && viewport) {
      initialize({
        target: root,
        elements: {
          viewport,
        },
      })
    }
  }, [initialize])

  const { getVirtualItems, getTotalSize, measureElement } = useVirtualizer({
    count: loading ? 10 : Math.ceil(data.length / size),
    getScrollElement: () => viewportRef.current,
    estimateSize: () => estimateSize,
  })

  const Wrapper = wrapper || 'div'

  const ChildContent = () => {
    if (!itemContent) return null
    const renderItem = loading ? loader : itemContent
    return getVirtualItems().map((row) => (
      <div
        key={row.key}
        data-index={row.index}
        ref={measureElement}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${row.start}px)`,
        }}
        className={rowClass}
      >
        {size === 1
          ? renderItem(data[row.index])
          : Array.from({ length: size }).map((_, i) => {
              const itemData = data[size * row.index + i]
              return loading ? <Fragment key={i}>{renderItem()}</Fragment> : itemData && <Fragment key={itemData.id}>{renderItem(itemData)}</Fragment>
            })}
      </div>
    ))
  }

  const EmptyDes = empty || 'No data'

  return (
    <div data-overlayscrollbars-initialize="" ref={rootRef} className="virtual-list">
      <div ref={viewportRef}>
        <Wrapper
          style={{
            height: `${getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {ChildContent()}
        </Wrapper>
        {!loading && data.length === 0 && (
          <div className="virtual-list__emty">
            <div className="empty-icon">
              <EmptyIcon />
            </div>
            <div className="empty-description">{EmptyDes}</div>
          </div>
        )}
      </div>
    </div>
  )
}

VirtualList.prototype = {
  data: PropTypes.array,
  size: PropTypes.number,
  loading: PropTypes.bool,
  estimateSize: PropTypes.number,
  wrapper: PropTypes.elementType,
  rowClass: PropTypes.string,
  itemContent: PropTypes.func,
  loader: PropTypes.element,
  empty: PropTypes.string,
}

export default memo(VirtualList)
