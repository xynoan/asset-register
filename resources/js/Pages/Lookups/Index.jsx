import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faArrowLeft, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '@/Components/Header';

export default function Index({ categories, brands, suppliers }) {
    const [activeTab, setActiveTab] = useState('categories');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentType, setCurrentType] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAssetsModal, setShowAssetsModal] = useState(false);
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [selectedLookup, setSelectedLookup] = useState(null);

    const handleOpenAddModal = (type) => {
        setCurrentType(type);
        setNewName('');
        setErrors({});
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setNewName('');
        setErrors({});
    };

    const handleOpenEditModal = (item, type) => {
        setCurrentItem(item);
        setCurrentType(type);
        setEditValue(item.name);
        setErrors({});
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentItem(null);
        setEditValue('');
        setErrors({});
    };

    const handleOpenDeleteModal = (item, type) => {
        if (item.usage_count > 0) {
            alert(`Cannot delete "${item.name}" because it is currently used by ${item.usage_count} asset(s).`);
            return;
        }
        setCurrentItem(item);
        setCurrentType(type);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setCurrentItem(null);
    };

    const handleOpenAssetsModal = async (item, type) => {
        if (item.usage_count === 0) {
            return; // No assets to show
        }

        setSelectedLookup({ item, type });
        setLoadingAssets(true);
        setShowAssetsModal(true);
        setAssets([]);

        try {
            const response = await axios.get(`/api/lookups/${type}/${item.id}/assets`);
            if (response.data.success) {
                setAssets(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching assets:', error);
            alert('Failed to load assets. Please try again.');
        } finally {
            setLoadingAssets(false);
        }
    };

    const handleCloseAssetsModal = () => {
        setShowAssetsModal(false);
        setAssets([]);
        setSelectedLookup(null);
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'In-use': 'bg-success',
            'Spare': 'bg-info',
            'Under Maintenance': 'bg-warning',
            'Retired': 'bg-secondary'
        };
        return statusClasses[status] || 'bg-secondary';
    };

    const handleSaveEdit = async () => {
        if (!editValue.trim()) {
            setErrors({ name: 'Name is required' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const routeName = `lookups.${currentType}.update`;
            const response = await axios.put(route(routeName, currentItem.id), {
                name: editValue.trim()
            });

            if (response.data.success) {
                handleCloseEditModal();
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

    const handleAdd = async () => {
        if (!newName.trim()) {
            setErrors({ newName: 'Name is required' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const routeName = `lookups.${currentType}.store`;
            const response = await axios.post(route(routeName), {
                name: newName.trim()
            });

            if (response.data.success) {
                handleCloseAddModal();
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

    const handleDelete = async () => {
        setLoading(true);

        try {
            const routeName = `lookups.${currentType}.delete`;
            const response = await axios.delete(route(routeName, currentItem.id));

            if (response.data.success) {
                handleCloseDeleteModal();
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
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleOpenAddModal(type)}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Add New
                    </button>
                </div>
                <div className="card-body">
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
                                                <strong>{item.name}</strong>
                                            </td>
                                            <td>
                                                <span 
                                                    className={`badge ${item.usage_count > 0 ? 'bg-warning text-dark' : 'bg-success'} ${item.usage_count > 0 ? 'cursor-pointer' : ''}`}
                                                    style={item.usage_count > 0 ? { cursor: 'pointer' } : {}}
                                                    onClick={() => item.usage_count > 0 && handleOpenAssetsModal(item, type)}
                                                    title={item.usage_count > 0 ? `Click to view ${item.usage_count} asset(s)` : ''}
                                                >
                                                    {item.usage_count} asset{item.usage_count !== 1 ? 's' : ''}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleOpenEditModal(item, type)}
                                                        disabled={loading}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} className="me-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleOpenDeleteModal(item, type)}
                                                        disabled={loading || item.usage_count > 0}
                                                        title={item.usage_count > 0 ? `Cannot delete: used by ${item.usage_count} asset(s)` : 'Delete'}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                                                        Delete
                                                    </button>
                                                </div>
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
                    <h1><FontAwesomeIcon icon={faCog} className="me-2" />Lookup Management</h1>
                    <Link href={route('assets.index')} className="btn btn-secondary">
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Back to Assets
                    </Link>
                </div>

                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('categories');
                                setShowAddModal(false);
                                setShowEditModal(false);
                                setShowDeleteModal(false);
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
                                setShowAddModal(false);
                                setShowEditModal(false);
                                setShowDeleteModal(false);
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
                                setShowAddModal(false);
                                setShowEditModal(false);
                                setShowDeleteModal(false);
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

                {/* Add Modal */}
                <div className={`modal fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New {currentType === 'categories' ? 'Category' : currentType === 'brands' ? 'Brand' : 'Supplier'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseAddModal} disabled={loading}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="newName" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="newName"
                                        className={`form-control ${errors.newName ? 'is-invalid' : ''}`}
                                        placeholder={`Enter ${currentType === 'categories' ? 'category' : currentType === 'brands' ? 'brand' : 'supplier'} name`}
                                        value={newName}
                                        onChange={e => {
                                            setNewName(e.target.value);
                                            setErrors({});
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAdd();
                                            }
                                        }}
                                        disabled={loading}
                                        autoFocus
                                    />
                                    {errors.newName && (
                                        <div className="invalid-feedback">
                                            {errors.newName}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseAddModal} disabled={loading}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-success" onClick={handleAdd} disabled={loading || !newName.trim()}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showAddModal && <div className="modal-backdrop fade show"></div>}

                {/* Edit Modal */}
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit {currentType === 'categories' ? 'Category' : currentType === 'brands' ? 'Brand' : 'Supplier'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseEditModal} disabled={loading}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="editValue" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="editValue"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={editValue}
                                        onChange={e => {
                                            setEditValue(e.target.value);
                                            setErrors({});
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSaveEdit();
                                            }
                                        }}
                                        disabled={loading}
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal} disabled={loading}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveEdit} disabled={loading || !editValue.trim()}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showEditModal && <div className="modal-backdrop fade show"></div>}

                {/* Delete Modal */}
                <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal} disabled={loading}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete <strong>"{currentItem?.name}"</strong>?</p>
                                <p className="text-danger mb-0">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal} disabled={loading}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showDeleteModal && <div className="modal-backdrop fade show"></div>}

                {/* Assets Modal */}
                <div className={`modal fade ${showAssetsModal ? 'show' : ''}`} style={{ display: showAssetsModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Assets for {selectedLookup?.type === 'categories' ? 'Category' : selectedLookup?.type === 'brands' ? 'Brand' : 'Supplier'}: <strong>{selectedLookup?.item?.name}</strong>
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseAssetsModal} disabled={loadingAssets}></button>
                            </div>
                            <div className="modal-body">
                                {loadingAssets ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : assets.length === 0 ? (
                                    <div className="text-muted text-center py-4">
                                        No assets found.
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Asset ID</th>
                                                    <th>Category</th>
                                                    <th>Brand / Manufacturer</th>
                                                    <th>Model Number</th>
                                                    <th>Serial Number</th>
                                                    <th>Status</th>
                                                    <th>Assigned To</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assets.map((asset) => (
                                                    <tr key={asset.id}>
                                                        <td><strong>{asset.asset_id}</strong></td>
                                                        <td>{asset.asset_category}</td>
                                                        <td>{asset.brand_manufacturer}</td>
                                                        <td>{asset.model_number || '—'}</td>
                                                        <td>{asset.serial_number || '—'}</td>
                                                        <td>
                                                            <span className={`badge ${getStatusBadgeClass(asset.status)}`}>
                                                                {asset.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {asset.assigned_employee ? (
                                                                <span>{asset.assigned_employee.full_name}</span>
                                                            ) : (
                                                                <span className="text-danger">Unassigned</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Link
                                                                href={route('assets.show', asset.id)}
                                                                className="btn btn-sm btn-outline-success"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseAssetsModal} disabled={loadingAssets}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showAssetsModal && <div className="modal-backdrop fade show"></div>}
            </div>
        </>
    );
}

