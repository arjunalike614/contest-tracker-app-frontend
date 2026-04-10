import { useState, useEffect } from 'react'
import axios from '../api/axios'

function UpsolvingPage() {
  const [entries, setEntries] = useState([])
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [contestName, setContestName] = useState('')
  const [customContest, setCustomContest] = useState(false)
  const [problemName, setProblemName] = useState('')
  const [problemUrl, setProblemUrl] = useState('')
  const [topic, setTopic] = useState('other')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchEntries()
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      const { data } = await axios.get('/api/contests')
      setContests(data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get('/api/upsolving')
      setEntries(data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/upsolving', {
        contestName, problemName, problemUrl, topic, notes
      })
      setShowForm(false)
      setContestName('')
      setProblemName('')
      setProblemUrl('')
      setNotes('')
      setCustomContest(false)
      fetchEntries()
    } catch (err) {
      console.log(err)
    }
  }

  const markSolved = async (id) => {
    try {
      await axios.patch(`/api/upsolving/${id}`)
      fetchEntries()
    } catch (err) {
      console.log(err)
    }
  }

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`/api/upsolving/${id}`)
      fetchEntries()
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <p style={styles.loading}>Loading...</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Upsolving Journal</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Problem'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Contest selector */}
          <div style={styles.contestRow}>
            {!customContest ? (
              <select
                style={styles.input}
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
                required={!customContest}
              >
                <option value="">Select a Contest</option>
                {contests.map(c => (
                  <option key={c._id} value={c.name}>
                    {c.name} ({c.platform})
                  </option>
                ))}
              </select>
            ) : (
              <input
                style={styles.input}
                placeholder="Enter contest name"
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
                required
              />
            )}
            <button
              type="button"
              style={styles.toggleBtn}
              onClick={() => {
                setCustomContest(!customContest)
                setContestName('')
              }}
            >
              {customContest ? 'Pick from list' : 'Custom'}
            </button>
          </div>

          <input style={styles.input} placeholder="Problem Name"
            value={problemName} onChange={(e) => setProblemName(e.target.value)} required />
          <input style={styles.input} placeholder="Problem URL (optional)"
            value={problemUrl} onChange={(e) => setProblemUrl(e.target.value)} />
          <select style={styles.input} value={topic} onChange={(e) => setTopic(e.target.value)}>
            {['arrays', 'dp', 'graphs', 'trees', 'math', 'greedy', 'other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <textarea style={styles.textarea} placeholder="Notes (optional)"
            value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button style={styles.submitBtn} type="submit">Save Problem</button>
        </form>
      )}

      {entries.length === 0
        ? <p style={styles.empty}>No problems logged yet.</p>
        : entries.map(entry => (
          <div key={entry._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.problemName}>{entry.problemName}</h3>
              <span style={{
                ...styles.status,
                background: entry.status === 'solved' ? '#10b981' : '#f59e0b'
              }}>
                {entry.status}
              </span>
            </div>
            <p style={styles.meta}>{entry.contestName} · {entry.topic}</p>
            {entry.notes && <p style={styles.notes}>{entry.notes}</p>}
            {entry.problemUrl && (
              <a href={entry.problemUrl} target="_blank" style={styles.link}>
                View Problem
              </a>
            )}
            <div style={styles.actions}>
              {entry.status === 'pending' && (
                <button style={styles.solvedBtn} onClick={() => markSolved(entry._id)}>
                  Mark Solved
                </button>
              )}
              <button style={styles.deleteBtn} onClick={() => deleteEntry(entry._id)}>
                Delete
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
  addBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' },
  form: { background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' },
  contestRow: { display: 'flex', gap: '0.5rem', marginBottom: '0rem' },
  toggleBtn: { background: '#475569', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: '1rem', boxSizing: 'border-box', minHeight: '80px' },
  submitBtn: { background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  problemName: { color: '#e2e8f0' },
  status: { padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'white', fontSize: '0.8rem' },
  meta: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' },
  notes: { color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' },
  link: { color: '#60a5fa', fontSize: '0.9rem', textDecoration: 'none' },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  solvedBtn: { background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  deleteBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  loading: { color: '#94a3b8', textAlign: 'center', marginTop: '2rem' },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }
}

export default UpsolvingPage