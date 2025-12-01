import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import Header from '@/Components/Header';

export default function Index({ categories, brands, suppliers }) {
    const [activeTab, setActiveTab] = useState('categories');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleEdit = (id, currentName) => {
        setEditingId(id);
        setEditValue(currentName);
        setErrors({});
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue('');
        setErrors({});
    };

    const handleSaveEdit = async (id, type) => {
        if (!editValue.trim()) {
            setErrors({ name: 'Name is required' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const routeName = `lookups.${type}.update`;
            const response = await axios.put(route(routeName, id), {
                name: editValue.trim()
            });

            if (response.data.success) {
                // Reload the page to get updated data
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.data?.errors?.name) {
                setErrors({ name: error.response.data.errors.name[0] });
            } else if (error.response?.data?.message) {
                setErrors({ name: error.response.data.message });
            } else {
                setErrors({ name: 'Failed to update' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (type) => {
        if (!newName.trim()) {
            setErrors({ newName: 'Name is required' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const routeName = `lookups.${type}.store`;
            const response = await axios.post(route(routeName), {
                name: newName.trim()
            });

            if (response.data.success) {
                setNewName('');
                setAdding(false);
                // Reload the page to get updated data
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.data?.errors?.name) {
                setErrors({ newName: error.response.data.errors.name[0] });
            } else if (error.response?.data?.message) {
                setErrors({ newName: error.response.data.message });
            } else {
                setErrors({ newName: 'Failed to add' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name, type, usageCount) => {
        if (usageCount > 0) {
            alert(`Cannot delete "${name}" because it is currently used by ${usageCount} asset(s).`);
            return;
        }

        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);

        try {
            const routeName = `lookups.${type}.delete`;
            const response = await axios.delete(route(routeName, id));

            if (response.data.success) {
                // Reload the page to get updated data
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to delete');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (items, type, singularName) => {
        return (
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{singularName}s</h5>
                    {!adding && (
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                                setAdding(true);
                                setNewName('');
                                setErrors({});
                            }}
                            disabled={loading}
                        >
                            + Add New
                        </button>
                    )}
                </div>
                <div className="card-body">
                    {adding && (
                        <div className="mb-3 p-3 border rounded bg-light">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control ${errors.newName ? 'is-invalid' : ''}`}
                                    placeholder={`Enter new ${singularName.toLowerCase()} name`}
                                    value={newName}
                                    onChange={e => {
                                        setNewName(e.target.value);
                                        setErrors({});
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAdd(type);
                                        } else if (e.key === 'Escape') {
                                            setAdding(false);
                                            setNewName('');
                                            setErrors({});
                                        }
                                    }}
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => handleAdd(type)}
                                    disabled={loading || !newName.trim()}
                                >
                                    {loading ? '...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setAdding(false);
                                        setNewName('');
                                        setErrors({});
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                            {errors.newName && (
                                <div className="invalid-feedback d-block mt-1">
                                    {errors.newName}
                                </div>
                            )}
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="text-muted text-center py-4">
                            No {singularName.toLowerCase()}s found. Click "Add New" to create one.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50%' }}>Name</th>
                                        <th style={{ width: '20%' }}>Usage Count</th>
                                        <th style={{ width: '30%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {editingId === item.id ? (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`}
                                                            value={editValue}
                                                            onChange={e => {
                                                                setEditValue(e.target.value);
                                                                setErrors({});
                                                            }}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleSaveEdit(item.id, type);
                                                                } else if (e.key === 'Escape') {
                                                                    handleCancelEdit();
                                                                }
                                                            }}
                                                            disabled={loading}
                                                            autoFocus
                                                        />
                                                        {errors.name && (
                                                            <div className="invalid-feedback d-block">
                                                                {errors.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <strong>{item.name}</strong>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${item.usage_count > 0 ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                    {item.usage_count} asset{item.usage_count !== 1 ? 's' : ''}
                                                </span>
                                            </td>
                                            <td>
                                                {editingId === item.id ? (
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            type="button"
                                                            className="btn btn-success"
                                                            onClick={() => handleSaveEdit(item.id, type)}
                                                            disabled={loading || !editValue.trim()}
                                                        >
                                                            {loading ? '...' : 'Save'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            onClick={handleCancelEdit}
                                                            disabled={loading}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary"
                                                            onClick={() => handleEdit(item.id, item.name)}
                                                            disabled={loading || editingId !== null}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(item.id, item.name, type, item.usage_count)}
                                                            disabled={loading || editingId !== null || item.usage_count > 0}
                                                            title={item.usage_count > 0 ? `Cannot delete: used by ${item.usage_count} asset(s)` : 'Delete'}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Lookup Management" />
            <Header activePage="lookups" />
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Lookup Management</h1>
                    <Link href={route('assets.index')} className="btn btn-secondary">
                        Back to Assets
                    </Link>
                </div>

                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('categories');
                                setEditingId(null);
                                setAdding(false);
                                setErrors({});
                            }}
                        >
                            Categories
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'brands' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('brands');
                                setEditingId(null);
                                setAdding(false);
                                setErrors({});
                            }}
                        >
                            Brands / Manufacturers
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'suppliers' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('suppliers');
                                setEditingId(null);
                                setAdding(false);
                                setErrors({});
                            }}
                        >
                            Suppliers
                        </button>
                    </li>
                </ul>

                {activeTab === 'categories' && renderTable(categories, 'categories', 'Category')}
                {activeTab === 'brands' && renderTable(brands, 'brands', 'Brand')}
                {activeTab === 'suppliers' && renderTable(suppliers, 'suppliers', 'Supplier')}
            </div>
        </>
    );
}

