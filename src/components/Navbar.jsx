import { Link,useNavigate } from "react-router-dom";


function Navbar ()
{ 
    const navigate = useNavigate();

    const logout = ()=>
    {
        localStorage.removeItem('token');
        navigate('/login')
    }


    return (
        <>
        <nav style={styles.nav}>
      <Link to="/contests" style={styles.brand}>Contest Tracker</Link>
      <div style={styles.links}>
        <Link to="/contests" style={styles.link}>Contests</Link>
        <Link to="/upsolving" style={styles.link}>Upsolving</Link>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>
    </nav>

        </>
    )

   

}
 const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155' },
  brand: { color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' },
  logout: { background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }
}

export default Navbar;