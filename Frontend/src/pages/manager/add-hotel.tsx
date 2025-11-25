import { useEffect, useState } from 'react';
import './manager.css';
import { useAuth } from '@/context/AuthContext';
import { addHotel, type NewHotelPayload } from '@/services/manager';
import { Hotel } from 'lucide-react';

const roomTypes: Array<{ label: string; value: 'standard' | 'deluxe' | 'suite' }> = [
  { label: 'Standard', value: 'standard' },
  { label: 'Deluxe', value: 'deluxe' },
  { label: 'Suite', value: 'suite' },
];

type Row = { type: 'standard' | 'deluxe' | 'suite'; price: number; available: number };

export default function ManagerAddHotelPage() {
  useEffect(() => { document.title = 'Add Hotel & Rooms | Manager Panel'; }, []);
  const { auth } = useAuth();

  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    amenities: '',
    image: ''
  });
  
  const [rows, setRows] = useState<Row[]>([
    { type: 'standard', price: 100, available: 0 },
    { type: 'deluxe', price: 150, available: 0 },
    { type: 'suite', price: 220, available: 0 },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);

    const payload: NewHotelPayload = {
      name: form.name,
      location: form.location,
      description: form.description,
      imageUrl: form.image,
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      rooms: rows,
    };

    try {
      await addHotel(payload);
      setSuccess(true);
      setForm({
        name: '',
        location: '',
        description: '',
        amenities: '',
        image: ''
      });
      setRows([
        { type: 'standard', price: 100, available: 0 },
        { type: 'deluxe', price: 150, available: 0 },
        { type: 'suite', price: 220, available: 0 },
      ]);
    } catch (err) {
      setError('Failed to add hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => setRows((r) => [...r, { type: 'standard', price: 0, available: 0 }]);
  const removeRow = (idx: number) => setRows((r) => r.filter((_, i) => i !== idx));
  const updateRow = (idx: number, patch: Partial<Row>) => setRows((r) => r.map((row, i) => i === idx ? { ...row, ...patch } : row));

  return (
    <div className="manager-page">
      <header>
        <h1>Add Hotels & Rooms</h1>
        <p className="text-muted-foreground">Create and manage your hotel properties with room configurations.</p>
      </header>

      <form onSubmit={onSubmit} className="add-hotel-form">
        <h2 className="form-title">
          <Hotel size={20} />
          Hotel Information
        </h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hotel Name</label>
            <input 
              className="form-input"
              name="name" 
              value={form.name} 
              onChange={onChange} 
              placeholder="Enter hotel name"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              className="form-input"
              name="location" 
              value={form.location} 
              onChange={onChange} 
              placeholder="City, State/Country"
              required 
            />
          </div>
        </div>

        <div className="form-row-full">
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea"
              name="description" 
              value={form.description} 
              onChange={onChange} 
              placeholder="Describe your hotel, its features, and what makes it special..."
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hotel Image URL</label>
            <input 
              className="form-input"
              name="image" 
              value={form.image} 
              onChange={onChange} 
              placeholder="https://example.com/hotel-image.jpg"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Amenities</label>
            <input 
              className="form-input"
              name="amenities" 
              value={form.amenities} 
              onChange={onChange} 
              placeholder="WiFi, Pool, Gym, Spa (comma separated)"
              required 
            />
          </div>
        </div>

        {/* Room Types Section */}
        <div className="form-row-full">
          <div className="form-group">
            <div className="flex items-center justify-between mb-4">
              <label className="form-label">Room Types & Pricing</label>
              <button type="button" className="action-button secondary" onClick={addRow}>
                Add Room Type
              </button>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room Type</th>
                    <th>Price per Night</th>
                    <th>Available Rooms</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <select 
                          className="form-select"
                          value={row.type} 
                          onChange={(e) => updateRow(idx, { type: e.target.value as Row['type'] })}
                        >
                          {roomTypes.map((rt) => (
                            <option key={rt.value} value={rt.value}>{rt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input 
                          className="form-input"
                          type="number" 
                          min={0} 
                          value={row.price} 
                          onChange={(e) => updateRow(idx, { price: Number(e.target.value) })} 
                        />
                      </td>
                      <td>
                        <input 
                          className="form-input"
                          type="number" 
                          min={0} 
                          value={row.available} 
                          onChange={(e) => updateRow(idx, { available: Number(e.target.value) })} 
                        />
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="action-button danger" 
                          onClick={() => removeRow(idx)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <button 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? 'Adding Hotel...' : 'Add Hotel'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          Hotel added successfully! It will be reviewed by admin before going live.
        </div>
      )}
    </div>
  );
}