import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [activeView, setActiveView] = useState('inventory');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSku, setEditingSku] = useState(null);
  const [formData, setFormData] = useState({ sku: '', name: '', category: 'Fans', qty: 1, price: '', loc: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('toran_inventory_v1');
    if (stored) {
      setInventory(JSON.parse(stored));
    } else {
      const seed = [
        { sku: 'FAN-001', name: 'Ceiling Fan A', category: 'Fans', qty: 12, price: 1499, loc: 'S1' },
        { sku: 'LGT-101', name: 'LED Bulb 9W', category: 'Lights', qty: 48, price: 199, loc: 'S3' },
        { sku: 'BEL-55', name: 'Door Bell Model X', category: 'Bells', qty: 8, price: 349, loc: 'S2' }
      ];
      setInventory(seed);
      localStorage.setItem('toran_inventory_v1', JSON.stringify(seed));
    }
    const theme = localStorage.getItem('toran_theme') || 'light';
    setIsDarkMode(theme === 'dark');
  }, []);

  // Update localStorage when inventory changes
  useEffect(() => {
    localStorage.setItem('toran_inventory_v1', JSON.stringify(inventory));
  }, [inventory]);

  // Apply theme
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('toran_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const filtered = inventory.filter(it => {
    if (filterCategory && it.category !== filterCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (it.sku + ' ' + it.name + ' ' + it.category + ' ' + (it.loc || '')).toLowerCase().includes(q);
  });

  const handleSaveItem = () => {
    if (!formData.sku || !formData.name) {
      alert('SKU and name required');
      return;
    }
    if (editingSku) {
      setInventory(inventory.map(i => i.sku === editingSku ? formData : i));
      setEditingSku(null);
    } else {
      if (inventory.find(i => i.sku === formData.sku)) {
        alert('SKU already exists');
        return;
      }
      setInventory([formData, ...inventory]);
    }
    setModalOpen(false);
    setFormData({ sku: '', name: '', category: 'Fans', qty: 1, price: '', loc: '' });
  };

  const handleDeleteItem = (sku) => {
    if (confirm('Delete ' + sku + '?')) {
      setInventory(inventory.filter(i => i.sku !== sku));
    }
  };

  const handleEditItem = (item) => {
    setFormData(item);
    setEditingSku(item.sku);
    setModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData({ sku: '', name: '', category: 'Fans', qty: 1, price: '', loc: '' });
    setEditingSku(null);
    setModalOpen(true);
  };

  const handleExportCSV = () => {
    const header = ['sku', 'name', 'category', 'qty', 'price', 'loc'];
    const rows = inventory.map(i => header.map(h => i[h]));
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toran_inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { text: chatInput, who: 'user' }]);
    setChatInput('');
    setChatMessages(prev => [...prev, { text: 'Typing...', who: 'ai' }]);
    setTimeout(() => {
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: 'I can help with that (demo reply)', who: 'ai' };
        return updated;
      });
    }, 600);
  };

  const totalItems = inventory.length;
  const totalStock = inventory.reduce((s, i) => s + (parseInt(i.qty) || 0), 0);
  const lowStock = inventory.filter(i => (parseInt(i.qty) || 0) < 5).length;

  return (
    <div className="app">
      <aside className="sidebar panel">
        <div className="brand">
          <div className="logo">TE</div>
          <div><h1>Toran Electronics</h1><p>Admin Dashboard</p></div>
        </div>
        <nav className="nav">
          {['inventory', 'orders', 'analytics', 'chat', 'settings'].map(v => (
            <button key={v} className={`nav-item ${activeView === v ? 'active' : ''}`} onClick={() => setActiveView(v)}>
              {v === 'inventory' && '📦 Inventory'}
              {v === 'orders' && '🧾 Orders'}
              {v === 'analytics' && '📊 Analytics'}
              {v === 'chat' && '💬 AI Chatbot'}
              {v === 'settings' && '⚙️ Settings'}
            </button>
          ))}
        </nav>
        <div className="toggle-row">
          <div className="switch">
            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>Dark</label>
            <div className="track" role="switch" aria-checked={isDarkMode} tabIndex={0} onClick={() => setIsDarkMode(!isDarkMode)}>
              <div className="thumb"></div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>v1.0</div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input className="search" placeholder="Search inventory or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="search" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">All categories</option>
              <option>Fans</option><option>Lights</option><option>Bells</option><option>Accessories</option>
            </select>
          </div>
          <div className="filters">
            <button className="btn" onClick={handleAddItem}>+ Add item</button>
            <button className="btn ghost" onClick={handleExportCSV}>Export CSV</button>
          </div>
        </div>

        {activeView === 'inventory' && (
          <section className="panel">
            <h2 style={{ marginTop: 0 }}>Inventory</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>SKU</th><th>Item</th><th>Category</th><th>Qty</th><th>Price (₹)</th><th>Location</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(it => (
                    <tr key={it.sku}>
                      <td>{it.sku}</td><td>{it.name}</td><td>{it.category}</td><td>{it.qty}</td><td>{it.price}</td><td>{it.loc || ''}</td>
                      <td className="actions">
                        <button className="btn ghost" onClick={() => handleEditItem(it)}>Edit</button>
                        <button className="btn" onClick={() => handleDeleteItem(it.sku)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'orders' && (
          <section className="panel">
            <h2 style={{ marginTop: 0 }}>Orders</h2>
            <p style={{ color: 'var(--muted)' }}>Orders will appear here (demo uses mock data).</p>
          </section>
        )}

        {activeView === 'analytics' && (
          <section className="panel">
            <h2 style={{ marginTop: 0 }}>Analytics</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }} className="panel"><strong>{totalItems}</strong><div style={{ color: 'var(--muted)' }}>Total item types</div></div>
              <div style={{ flex: 1 }} className="panel"><strong>{totalStock}</strong><div style={{ color: 'var(--muted)' }}>Total units in stock</div></div>
              <div style={{ flex: 1 }} className="panel"><strong>{lowStock}</strong><div style={{ color: 'var(--muted)' }}>Low stock items (&lt;5)</div></div>
            </div>
          </section>
        )}

        {activeView === 'chat' && (
          <section className="panel">
            <h2 style={{ marginTop: 0 }}>AI Chatbot — Toran Electronics</h2>
            <div className="chat-area">
              <div className="messages" style={{ display: 'flex', flexDirection: 'column' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`bubble ${msg.who}`}>{msg.text}</div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input placeholder="Ask about inventory, orders, or products..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} />
                <button className="btn" onClick={handleSendChat}>Send</button>
              </div>
            </div>
          </section>
        )}

        {activeView === 'settings' && (
          <section className="panel">
            <h2 style={{ marginTop: 0 }}>Settings</h2>
            <p style={{ color: 'var(--muted)' }}>Theme and integration settings</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>API Endpoint (demo): <input className="search" placeholder="https://your-api.example/chat" /></label>
              <label>API Key: <input className="search" placeholder="(optional for demo)" /></label>
              <button className="btn" onClick={() => alert('Settings saved (demo)')}>Save</button>
            </div>
          </section>
        )}
      </main>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', minWidth: '320px', boxShadow: '0 12px 40px var(--glass)' }}>
            <h3>{editingSku ? 'Edit item' : 'Add item'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input className="search" placeholder="SKU (unique)" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} disabled={!!editingSku} />
              <input className="search" placeholder="Item name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <select className="search" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}><option>Fans</option><option>Lights</option><option>Bells</option><option>Accessories</option></select>
              <input className="search" type="number" placeholder="Quantity" value={formData.qty} onChange={e => setFormData({ ...formData, qty: e.target.value })} />
              <input className="search" type="number" placeholder="Price (₹)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              <input className="search" placeholder="Location (shelf)" value={formData.loc} onChange={e => setFormData({ ...formData, loc: e.target.value })} />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button className="btn ghost" onClick={() => { setModalOpen(false); setFormData({ sku: '', name: '', category: 'Fans', qty: 1, price: '', loc: '' }); }}>Cancel</button>
                <button className="btn" onClick={handleSaveItem}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
