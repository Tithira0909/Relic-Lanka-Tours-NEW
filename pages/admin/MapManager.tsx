import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

interface MapPin {
    id: string;
    name: string;
    description: string;
    image: string;
    x: number;
    y: number;
}

const MapManager: React.FC = () => {
    const [pins, setPins] = useState<MapPin[]>([]);
    const [editingPin, setEditingPin] = useState<MapPin | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newPin, setNewPin] = useState<Partial<MapPin>>({});
    const [uploading, setUploading] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPins();
    }, []);

    const fetchPins = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/map_pins');
            setPins(res.data);
        } catch (err) {
            console.error("Failed to fetch map pins", err);
        }
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!mapRef.current) return;

        if (!isAdding && !editingPin) return;

        const rect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (editingPin) {
            setEditingPin({ ...editingPin, x, y });
        } else if (isAdding) {
            setNewPin({ ...newPin, x, y });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (isEdit && editingPin) {
                setEditingPin({ ...editingPin, image: res.data.imageUrl });
            } else {
                setNewPin({ ...newPin, image: res.data.imageUrl });
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const savePin = async () => {
        const token = localStorage.getItem('token');
        try {
            if (editingPin) {
                await axios.put(`http://localhost:3001/api/map_pins/${editingPin.id}`, editingPin, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setEditingPin(null);
            } else if (isAdding) {
                if (!newPin.x || !newPin.y || !newPin.name) {
                    alert("Please click on the map to set a location and enter a name.");
                    return;
                }
                const pin = { ...newPin, id: Date.now().toString() };
                await axios.post('http://localhost:3001/api/map_pins', pin, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setIsAdding(false);
                setNewPin({});
            }
            fetchPins();
        } catch (err) {
            console.error("Failed to save pin", err);
            alert("Failed to save pin");
        }
    };

    const deletePin = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3001/api/map_pins/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPins();
        } catch (err) {
            console.error("Failed to delete pin", err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Interactive Map Manager</h2>

            <div className="flex gap-6">
                {/* Map Area */}
                <div className="relative w-2/3 border rounded overflow-hidden" ref={mapRef} onClick={handleMapClick} style={{ cursor: (isAdding || editingPin) ? 'crosshair' : 'default' }}>
                    <img src="/assets/interactive-map.png" alt="Map" className="w-full h-auto" />

                    {/* Render Pins */}
                    {pins.map(pin => (
                        <div
                            key={pin.id}
                            className={`absolute w-4 h-4 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                                ${editingPin?.id === pin.id ? 'bg-green-500 z-20 scale-125' : 'bg-red-500 z-10 hover:scale-110'}
                            `}
                            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                            title={pin.name}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isAdding && !editingPin) {
                                    setEditingPin(pin);
                                }
                            }}
                        />
                    ))}

                    {/* Pending Pin (New) */}
                    {isAdding && newPin.x && newPin.y && (
                         <div
                         className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-20 animate-pulse"
                         style={{ left: `${newPin.x}%`, top: `${newPin.y}%` }}
                     />
                    )}
                </div>

                {/* Controls Area */}
                <div className="w-1/3 space-y-4">
                    <div className="bg-gray-50 p-4 rounded border">
                        <h3 className="font-semibold mb-2">
                            {editingPin ? "Edit Pin" : isAdding ? "New Pin" : "Select a pin or add new"}
                        </h3>

                        {(editingPin || isAdding) ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium">Location</label>
                                    <p className="text-xs text-gray-500">
                                        Click on the map to set location.
                                        <br/>
                                        X: {((editingPin ? editingPin.x : newPin.x) || 0).toFixed(1)}%,
                                        Y: {((editingPin ? editingPin.y : newPin.y) || 0).toFixed(1)}%
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={editingPin ? editingPin.name : newPin.name || ''}
                                        onChange={e => editingPin ? setEditingPin({...editingPin, name: e.target.value}) : setNewPin({...newPin, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea
                                        className="w-full border p-2 rounded"
                                        value={editingPin ? editingPin.description : newPin.description || ''}
                                        onChange={e => editingPin ? setEditingPin({...editingPin, description: e.target.value}) : setNewPin({...newPin, description: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Image</label>
                                    <input type="file" onChange={e => handleImageUpload(e, !!editingPin)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                                    {uploading && <p className="text-xs text-blue-500">Uploading...</p>}
                                    {(editingPin?.image || newPin.image) && (
                                        <img src={editingPin?.image || newPin.image} alt="Preview" className="mt-2 h-20 w-auto rounded border" />
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button onClick={savePin} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700">
                                        <Save size={16} /> Save
                                    </button>
                                    <button onClick={() => { setEditingPin(null); setIsAdding(false); setNewPin({}); }} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600">
                                        <X size={16} /> Cancel
                                    </button>
                                </div>

                                {editingPin && (
                                    <button onClick={() => deletePin(editingPin.id)} className="w-full mt-2 border border-red-500 text-red-500 px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-50">
                                        <Trash2 size={16} /> Delete Pin
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => { setIsAdding(true); setNewPin({}); setEditingPin(null); }} className="w-full bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700">
                                <Plus size={16} /> Add New Pin
                            </button>
                        )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                        <h4 className="font-semibold text-sm text-gray-600">All Pins ({pins.length})</h4>
                        {pins.map(pin => (
                            <div
                                key={pin.id}
                                className={`p-2 border rounded cursor-pointer hover:bg-gray-50 flex items-center justify-between ${editingPin?.id === pin.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                onClick={() => { setEditingPin(pin); setIsAdding(false); }}
                            >
                                <span className="font-medium truncate">{pin.name}</span>
                                <span className="text-xs text-gray-500">({pin.x.toFixed(0)}, {pin.y.toFixed(0)})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapManager;
