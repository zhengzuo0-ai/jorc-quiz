import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/practice', label: '练习', icon: '⛏' },
  { to: '/concepts', label: '概念', icon: '📖' },
  { to: '/review', label: '错题本', icon: '❌' },
  { to: '/exam', label: '模考', icon: '📝' },
  { to: '/progress', label: '进度', icon: '📊' },
];

function SidebarLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-[var(--gold-dim)] text-[var(--text-light)] border-l-2 border-[var(--gold)]'
            : 'text-[var(--text-muted)] hover:text-[var(--text-light)] hover:bg-[rgba(255,255,255,0.05)]'
        }`
      }
    >
      <span className="text-base">{icon}</span>
      {label}
    </NavLink>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--cream)' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 p-5"
        style={{ background: 'var(--navy-dark)' }}
      >
        <div className="mb-8">
          <h1
            className="text-xl font-semibold tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-light)' }}
          >
            <span style={{ color: 'var(--gold)' }}>⛏</span> JORC Quiz
          </h1>
          <div className="mt-3 h-px" style={{ background: 'linear-gradient(to right, var(--gold), transparent)' }} />
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Mining Knowledge Platform
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 min-w-0 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex border-t"
        style={{
          background: 'var(--navy-dark)',
          borderColor: 'var(--navy-light)',
        }}
      >
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2.5 text-[10px] font-medium transition-colors duration-200 ${
                isActive ? '' : ''
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--gold)' : 'var(--text-muted)',
            })}
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
