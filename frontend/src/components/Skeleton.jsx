function Skeleton({ width, height, borderRadius = 8, style }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || 20,
        borderRadius,
        ...style,
      }}
    />
  )
}

export function AnalyticsSkeleton() {
  return (
    <section className="section">
      <Skeleton width={220} height={36} style={{ marginBottom: 32 }} />
      <div className="analytics-stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="analytics-stat-card">
            <Skeleton width={40} height={40} borderRadius="50%" />
            <Skeleton width={60} height={32} style={{ marginTop: 12 }} />
            <Skeleton width={90} height={16} style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
      <div className="analytics-charts" style={{ marginTop: 32 }}>
        <div className="analytics-chart-card">
          <Skeleton width={180} height={24} />
          <Skeleton height={250} style={{ marginTop: 16 }} />
        </div>
        <div className="analytics-chart-card">
          <Skeleton width={180} height={24} />
          <Skeleton height={300} style={{ marginTop: 16 }} />
        </div>
      </div>
    </section>
  )
}

export function ProjectsSkeleton() {
  return (
    <div className="projects-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="project-card" style={{ pointerEvents: 'none' }}>
          <Skeleton height={140} borderRadius={0} />
          <div className="project-info">
            <Skeleton width="70%" height={22} />
            <Skeleton height={14} style={{ marginTop: 10 }} />
            <Skeleton width="50%" height={14} style={{ marginTop: 6 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <Skeleton width={60} height={14} />
              <Skeleton width={40} height={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BlogSkeleton() {
  return (
    <div className="blog-grid">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="blog-card" style={{ pointerEvents: 'none' }}>
          <Skeleton height={180} borderRadius={0} />
          <div className="blog-card-content">
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <Skeleton width={80} height={14} />
              <Skeleton width={70} height={14} />
            </div>
            <Skeleton width="85%" height={22} />
            <Skeleton height={14} style={{ marginTop: 10 }} />
            <Skeleton width="60%" height={14} style={{ marginTop: 6 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Skeleton
