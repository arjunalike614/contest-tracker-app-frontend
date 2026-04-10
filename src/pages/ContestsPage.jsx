import { useState, useEffect } from 'react'
import axios from '../api/axios'

function ContestsPage() {
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const url = filter === 'all' ? '/api/contests' : `/api/contests?platform=${filter}`
        const { data } = await axios.get(url)
        setContests(data)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }
    fetchContests()
  }, [filter])

  const addToCalendar = async (contestId) => {
    try {
      await axios.post(`/api/calendar/add/${contestId}`)
      alert('Added to Google Calendar!')
    } catch (err) {
      alert('Connect Google Calendar first')
    }
  }

  const connectCalendar = async () => {
    try {
      const { data } = await axios.get('/api/calendar/auth')
      window.open(data.url, '_blank')
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <p style={styles.loading}>Loading contests...</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Upcoming Contests</h1>
        <button style={styles.calendarBtn} onClick={connectCalendar}>
          Connect Google Calendar
        </button>
      </div>

      <div style={styles.filters}>
        {['all', 'codeforces', 'leetcode'].map(f => (
          <button
            key={f}
            style={{
              ...styles.filterBtn,
              background: filter === f ? '#3b82f6' : '#1e293b'
            }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {contests.length === 0
        ? <p style={styles.empty}>No upcoming contests found.</p>
        : contests.map(contest => (
          <div key={contest._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.contestName}>{contest.name}</h3>
              <span style={styles.platform}>{contest.platform}</span>
            </div>
            <p style={styles.time}>
              {new Date(contest.startTime).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata'
              })}
            </p>
            <p style={styles.duration}>Duration: {contest.duration} hours</p>
            <div style={styles.cardActions}>
              <a href={contest.url} target="_blank" style={styles.link}>
                View Contest
              </a>
              <button
                style={styles.calBtn}
                onClick={() => addToCalendar(contest._id)}
              >
                + Calendar
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { color: '#60a5fa', fontSize: '1.8rem' },
  calendarBtn: { background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  filterBtn: { color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  contestName: { color: '#e2e8f0', fontSize: '1.1rem' },
  platform: { background: '#3b82f6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' },
  time: { color: '#94a3b8', marginBottom: '0.3rem', fontSize: '0.9rem' },
  duration: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' },
  cardActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
  link: { color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem' },
  calBtn: { background: '#1d4ed8', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  loading: { color: '#94a3b8', textAlign: 'center', marginTop: '2rem' },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }
}

export default ContestsPage