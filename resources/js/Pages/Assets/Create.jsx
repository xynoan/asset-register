import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Create({ employees }) {
    const { auth } = usePage().props;
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for adding new values
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddBrand, setShowAddBrand] = useState(false);
    const [showAddSupplier, setShowAddSupplier] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const [newSupplierName, setNewSupplierName] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);
    const [addingBrand, setAddingBrand] = useState(false);
    const [addingSupplier, setAddingSupplier] = useState(false);

    // States for removing values
    const [showRemoveCategory, setShowRemoveCategory] = useState(false);
    const [showRemoveBrand, setShowRemoveBrand] = useState(false);
    const [showRemoveSupplier, setShowRemoveSupplier] = useState(false);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState('');
    const [selectedBrandToDelete, setSelectedBrandToDelete] = useState('');
    const [selectedSupplierToDelete, setSelectedSupplierToDelete] = useState('');
    const [deletingCategory, setDeletingCategory] = useState(false);
    const [deletingBrand, setDeletingBrand] = useState(false);
    const [deletingSupplier, setDeletingSupplier] = useState(false);

    // State for maintenance entry validation errors
    const [maintenanceErrors, setMaintenanceErrors] = useState({});

    const fetchLookups = () => {
        setLoading(true);
        Promise.all([
            axios.get(route('lookups.categories')),
            axios.get(route('lookups.brands')),
            axios.get(route('lookups.suppliers'))
        ]).then(([catsRes, brandsRes, suppRes]) => {
            setCategories(catsRes.data.data || []);
            setBrands(brandsRes.data.data || []);
            setSuppliers(suppRes.data.data || []);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchLookups();
    }, []);
    const { data, setData, post, processing, errors, reset } = useForm({
        asset_category: '',
        brand_manufacturer: '',
        model_number: '',
        serial_number: '',
        purchase_date: '',
        vendor_supplier: '',
        warranty_expiry_date: '',
        status: 'Spare',
        maintenance_history: [],
        comments_history: [],
        notes: [],
        documents: [],
        assigned_to: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check if there are any maintenance entry validation errors
        if (Object.keys(maintenanceErrors).length > 0) {
            alert('Please fix the validation errors in the maintenance history before submitting.');
            return;
        }
        
        post(route('assets.store'), {
            onSuccess: () => {
                window.location.href = route('assets.index');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    const addMaintenanceEntry = () => {
        setData('maintenance_history', [
            ...data.maintenance_history,
            { date: '', description: '', cost: '', performed_by: '' }
        ]);
    };

    const removeMaintenanceEntry = (index) => {
        setData('maintenance_history', 
            data.maintenance_history.filter((_, i) => i !== index)
        );
        // Clean up validation errors for removed entry
        const errors = { ...maintenanceErrors };
        // Re-index errors after removal
        const newErrors = {};
        Object.keys(errors).forEach(key => {
            const keyNum = parseInt(key);
            if (keyNum < index) {
                newErrors[keyNum] = errors[key];
            } else if (keyNum > index) {
                newErrors[keyNum - 1] = errors[key];
            }
        });
        setMaintenanceErrors(newErrors);
    };

    const updateMaintenanceEntry = (index, field, value) => {
        const updated = [...data.maintenance_history];
        updated[index] = { ...updated[index], [field]: value };
        setData('maintenance_history', updated);
        
        // Validate cost field - must be integer
        if (field === 'cost') {
            const errors = { ...maintenanceErrors };
            if (value && value.trim() !== '') {
                // Check if value is a valid integer (allows empty string, allows negative)
                const integerRegex = /^-?\d+$/;
                if (!integerRegex.test(value.trim())) {
                    errors[index] = 'Cost must be a whole number (integer)';
                } else {
                    delete errors[index];
                }
            } else {
                // Clear error if field is empty
                delete errors[index];
            }
            setMaintenanceErrors(errors);
        }
    };

    const addNote = () => {
        setData('notes', [
            ...data.notes,
            { date: '', note: '', added_by: 'System' }
        ]);
    };

    const removeNote = (index) => {
        setData('notes', 
            data.notes.filter((_, i) => i !== index)
        );
    };

    const updateNote = (index, field, value) => {
        const updated = [...data.notes];
        updated[index] = { ...updated[index], [field]: value };
        setData('notes', updated);
    };

    const addComment = () => {
        setData('comments_history', [
            ...data.comments_history,
            { date: '', comment: '', added_by: 'System' }
        ]);
    };

    const removeComment = (index) => {
        setData('comments_history', 
            data.comments_history.filter((_, i) => i !== index)
        );
    };

    const updateComment = (index, field, value) => {
        const updated = [...data.comments_history];
        updated[index] = { ...updated[index], [field]: value };
        setData('comments_history', updated);
    };

    const handleDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setData('documents', [...data.documents, ...files]);
        // Clear the input so users can add more files
        e.target.value = '';
    };

    const removeDocument = (index) => {
        const updated = data.documents.filter((_, i) => i !== index);
        setData('documents', updated);
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setAddingCategory(true);
        try {
            const response = await axios.post(route('lookups.categories.store'), {
                name: newCategoryName.trim()
            });
            if (response.data.success) {
                setCategories([...categories, response.data.data]);
                setData('asset_category', response.data.data.name);
                setNewCategoryName('');
                setShowAddCategory(false);
            }
        } catch (error) {
            if (error.response?.data?.errors?.name) {
                alert(error.response.data.errors.name[0]);
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                console.error('Error adding category:', error);
                alert('Failed to add category: ' + (error.message || 'Unknown error'));
            }
        } finally {
            setAddingCategory(false);
        }
    };

    const handleAddBrand = async () => {
        if (!newBrandName.trim()) return;
        setAddingBrand(true);
        try {
            const response = await axios.post(route('lookups.brands.store'), {
                name: newBrandName.trim()
            });
            if (response.data.success) {
                setBrands([...brands, response.data.data]);
                setData('brand_manufacturer', response.data.data.name);
                setNewBrandName('');
                setShowAddBrand(false);
            }
        } catch (error) {
            if (error.response?.data?.errors?.name) {
                alert(error.response.data.errors.name[0]);
            } else {
                alert('Failed to add brand');
            }
        } finally {
            setAddingBrand(false);
        }
    };

    const handleAddSupplier = async () => {
        if (!newSupplierName.trim()) return;
        setAddingSupplier(true);
        try {
            const response = await axios.post(route('lookups.suppliers.store'), {
                name: newSupplierName.trim()
            });
            if (response.data.success) {
                setSuppliers([...suppliers, response.data.data]);
                setData('vendor_supplier', response.data.data.name);
                setNewSupplierName('');
                setShowAddSupplier(false);
            }
        } catch (error) {
            if (error.response?.data?.errors?.name) {
                alert(error.response.data.errors.name[0]);
            } else {
                alert('Failed to add supplier');
            }
        } finally {
            setAddingSupplier(false);
        }
    };

    const handleDeleteCategory = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        setDeletingCategory(true);
        try {
            const response = await axios.delete(route('lookups.categories.delete', id));
            if (response.data.success) {
                setCategories(categories.filter(cat => cat.id !== id));
                if (data.asset_category === name) {
                    setData('asset_category', '');
                }
                setSelectedCategoryToDelete('');
                setShowRemoveCategory(false);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to delete category');
            }
        } finally {
            setDeletingCategory(false);
        }
    };

    const handleConfirmDeleteCategory = () => {
        if (!selectedCategoryToDelete) return;
        const category = categories.find(cat => cat.id === parseInt(selectedCategoryToDelete));
        if (category) {
            handleDeleteCategory(category.id, category.name);
        }
    };

    const handleDeleteBrand = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        setDeletingBrand(true);
        try {
            const response = await axios.delete(route('lookups.brands.delete', id));
            if (response.data.success) {
                setBrands(brands.filter(brand => brand.id !== id));
                if (data.brand_manufacturer === name) {
                    setData('brand_manufacturer', '');
                }
                setSelectedBrandToDelete('');
                setShowRemoveBrand(false);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to delete brand');
            }
        } finally {
            setDeletingBrand(false);
        }
    };

    const handleConfirmDeleteBrand = () => {
        if (!selectedBrandToDelete) return;
        const brand = brands.find(b => b.id === parseInt(selectedBrandToDelete));
        if (brand) {
            handleDeleteBrand(brand.id, brand.name);
        }
    };

    const handleDeleteSupplier = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        setDeletingSupplier(true);
        try {
            const response = await axios.delete(route('lookups.suppliers.delete', id));
            if (response.data.success) {
                setSuppliers(suppliers.filter(supplier => supplier.id !== id));
                if (data.vendor_supplier === name) {
                    setData('vendor_supplier', '');
                }
                setSelectedSupplierToDelete('');
                setShowRemoveSupplier(false);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to delete supplier');
            }
        } finally {
            setDeletingSupplier(false);
        }
    };

    const handleConfirmDeleteSupplier = () => {
        if (!selectedSupplierToDelete) return;
        const supplier = suppliers.find(s => s.id === parseInt(selectedSupplierToDelete));
        if (supplier) {
            handleDeleteSupplier(supplier.id, supplier.name);
        }
    };

    const statusOptions = ['In-use', 'Spare', 'Under Maintenance', 'Retired'];

    return (
        <>
            <Head title="Add New Asset" />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Add New Asset</h1>
                    <Link 
                        href={route('assets.index')} 
                        className="btn btn-secondary"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Asset Information</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label htmlFor="asset_category" className="form-label mb-0">Asset Category <span className="text-danger">*</span></label>
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 text-decoration-none"
                                                    onClick={() => {
                                                        setShowAddCategory(!showAddCategory);
                                                        setShowRemoveCategory(false);
                                                    }}
                                                >
                                                    {showAddCategory ? 'Cancel' : '+ Add New'}
                                                </button>
                                                {categories.length > 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link p-0 text-decoration-none text-danger"
                                                        onClick={() => {
                                                            setShowRemoveCategory(!showRemoveCategory);
                                                            setShowAddCategory(false);
                                                        }}
                                                    >
                                                        {showRemoveCategory ? 'Cancel' : '- Remove'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {showAddCategory ? (
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter new category"
                                                    value={newCategoryName}
                                                    onChange={e => setNewCategoryName(e.target.value)}
                                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleAddCategory}
                                                    disabled={addingCategory || !newCategoryName.trim()}
                                                >
                                                    {addingCategory ? '...' : 'Add'}
                                                </button>
                                            </div>
                                        ) : null}
                                        {showRemoveCategory ? (
                                            <div className="input-group mb-2">
                                                <select
                                                    className="form-select"
                                                    value={selectedCategoryToDelete}
                                                    onChange={e => setSelectedCategoryToDelete(e.target.value)}
                                                >
                                                    <option value="">Select category to delete</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={handleConfirmDeleteCategory}
                                                    disabled={deletingCategory || !selectedCategoryToDelete}
                                                >
                                                    {deletingCategory ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        ) : null}
                                        <select
                                            className={`form-select ${errors.asset_category ? 'is-invalid' : ''}`}
                                            id="asset_category"
                                            value={data.asset_category}
                                            onChange={e => setData('asset_category', e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.asset_category && (
                                            <div className="invalid-feedback">
                                                {errors.asset_category}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label htmlFor="brand_manufacturer" className="form-label mb-0">Brand / Manufacturer <span className="text-danger">*</span></label>
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 text-decoration-none"
                                                    onClick={() => {
                                                        setShowAddBrand(!showAddBrand);
                                                        setShowRemoveBrand(false);
                                                    }}
                                                >
                                                    {showAddBrand ? 'Cancel' : '+ Add New'}
                                                </button>
                                                {brands.length > 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link p-0 text-decoration-none text-danger"
                                                        onClick={() => {
                                                            setShowRemoveBrand(!showRemoveBrand);
                                                            setShowAddBrand(false);
                                                        }}
                                                    >
                                                        {showRemoveBrand ? 'Cancel' : '- Remove'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {showAddBrand ? (
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter new brand"
                                                    value={newBrandName}
                                                    onChange={e => setNewBrandName(e.target.value)}
                                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddBrand())}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleAddBrand}
                                                    disabled={addingBrand || !newBrandName.trim()}
                                                >
                                                    {addingBrand ? '...' : 'Add'}
                                                </button>
                                            </div>
                                        ) : null}
                                        {showRemoveBrand ? (
                                            <div className="input-group mb-2">
                                                <select
                                                    className="form-select"
                                                    value={selectedBrandToDelete}
                                                    onChange={e => setSelectedBrandToDelete(e.target.value)}
                                                >
                                                    <option value="">Select brand to delete</option>
                                                    {brands.map(brand => (
                                                        <option key={brand.id} value={brand.id}>
                                                            {brand.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={handleConfirmDeleteBrand}
                                                    disabled={deletingBrand || !selectedBrandToDelete}
                                                >
                                                    {deletingBrand ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        ) : null}
                                        <select
                                            className={`form-select ${errors.brand_manufacturer ? 'is-invalid' : ''}`}
                                            id="brand_manufacturer"
                                            value={data.brand_manufacturer}
                                            onChange={e => setData('brand_manufacturer', e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="">Select Brand / Manufacturer</option>
                                            {brands.map(brand => (
                                                <option key={brand.id} value={brand.name}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.brand_manufacturer && (
                                            <div className="invalid-feedback">
                                                {errors.brand_manufacturer}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="model_number" className="form-label">Model Number <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.model_number ? 'is-invalid' : ''}`}
                                            id="model_number"
                                            value={data.model_number}
                                            onChange={e => setData('model_number', e.target.value)}
                                        />
                                        {errors.model_number && (
                                            <div className="invalid-feedback">
                                                {errors.model_number}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="serial_number" className="form-label">Serial Number <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.serial_number ? 'is-invalid' : ''}`}
                                            id="serial_number"
                                            value={data.serial_number}
                                            onChange={e => setData('serial_number', e.target.value)}
                                        />
                                        {errors.serial_number && (
                                            <div className="invalid-feedback">
                                                {errors.serial_number}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="purchase_date" className="form-label">Purchase Date <span className="text-danger">*</span></label>
                                        <input 
                                            type="date" 
                                            className={`form-control ${errors.purchase_date ? 'is-invalid' : ''}`}
                                            id="purchase_date"
                                            value={data.purchase_date}
                                            onChange={e => setData('purchase_date', e.target.value)}
                                        />
                                        {errors.purchase_date && (
                                            <div className="invalid-feedback">
                                                {errors.purchase_date}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label htmlFor="vendor_supplier" className="form-label mb-0">Vendor / Supplier</label>
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 text-decoration-none"
                                                    onClick={() => {
                                                        setShowAddSupplier(!showAddSupplier);
                                                        setShowRemoveSupplier(false);
                                                    }}
                                                >
                                                    {showAddSupplier ? 'Cancel' : '+ Add New'}
                                                </button>
                                                {suppliers.length > 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link p-0 text-decoration-none text-danger"
                                                        onClick={() => {
                                                            setShowRemoveSupplier(!showRemoveSupplier);
                                                            setShowAddSupplier(false);
                                                        }}
                                                    >
                                                        {showRemoveSupplier ? 'Cancel' : '- Remove'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {showAddSupplier ? (
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter new supplier"
                                                    value={newSupplierName}
                                                    onChange={e => setNewSupplierName(e.target.value)}
                                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSupplier())}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleAddSupplier}
                                                    disabled={addingSupplier || !newSupplierName.trim()}
                                                >
                                                    {addingSupplier ? '...' : 'Add'}
                                                </button>
                                            </div>
                                        ) : null}
                                        {showRemoveSupplier ? (
                                            <div className="input-group mb-2">
                                                <select
                                                    className="form-select"
                                                    value={selectedSupplierToDelete}
                                                    onChange={e => setSelectedSupplierToDelete(e.target.value)}
                                                >
                                                    <option value="">Select supplier to delete</option>
                                                    {suppliers.map(supplier => (
                                                        <option key={supplier.id} value={supplier.id}>
                                                            {supplier.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={handleConfirmDeleteSupplier}
                                                    disabled={deletingSupplier || !selectedSupplierToDelete}
                                                >
                                                    {deletingSupplier ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        ) : null}
                                        <select
                                            className={`form-select ${errors.vendor_supplier ? 'is-invalid' : ''}`}
                                            id="vendor_supplier"
                                            value={data.vendor_supplier}
                                            onChange={e => setData('vendor_supplier', e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map(supplier => (
                                                <option key={supplier.id} value={supplier.name}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.vendor_supplier && (
                                            <div className="invalid-feedback">
                                                {errors.vendor_supplier}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="warranty_expiry_date" className="form-label">Warranty Expiry Date</label>
                                        <input 
                                            type="date" 
                                            className={`form-control ${errors.warranty_expiry_date ? 'is-invalid' : ''}`}
                                            id="warranty_expiry_date"
                                            value={data.warranty_expiry_date}
                                            onChange={e => setData('warranty_expiry_date', e.target.value)}
                                        />
                                        {errors.warranty_expiry_date && (
                                            <div className="invalid-feedback">
                                                {errors.warranty_expiry_date}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Status <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                            id="status"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        {errors.status && (
                                            <div className="invalid-feedback">
                                                {errors.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="assigned_to" className="form-label">Assigned To</label>
                                        <select
                                            className={`form-select ${errors.assigned_to ? 'is-invalid' : ''}`}
                                            id="assigned_to"
                                            value={data.assigned_to}
                                            onChange={e => setData('assigned_to', e.target.value)}
                                        >
                                            <option value="">Unassigned</option>
                                            {employees.map(employee => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.full_name} ({employee.employee_no})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.assigned_to && (
                                            <div className="invalid-feedback">
                                                {errors.assigned_to}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label htmlFor="maintenance_history" className="form-label mb-0">Maintenance History</label>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={addMaintenanceEntry}
                                    >
                                        + Add Entry
                                    </button>
                                </div>
                                {data.maintenance_history.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '15%' }}>Date</th>
                                                    <th style={{ width: '40%' }}>Description</th>
                                                    <th style={{ width: '15%' }}>Cost</th>
                                                    <th style={{ width: '20%' }}>Performed By</th>
                                                    <th style={{ width: '10%' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.maintenance_history.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                value={entry.date || ''}
                                                                onChange={e => updateMaintenanceEntry(index, 'date', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={entry.description || ''}
                                                                onChange={e => updateMaintenanceEntry(index, 'description', e.target.value)}
                                                                placeholder="Maintenance description"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={`form-control form-control-sm ${maintenanceErrors[index] ? 'is-invalid' : ''}`}
                                                                value={entry.cost || ''}
                                                                onChange={e => updateMaintenanceEntry(index, 'cost', e.target.value)}
                                                                placeholder="Cost"
                                                            />
                                                            {maintenanceErrors[index] && (
                                                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                                                    {maintenanceErrors[index]}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                value={entry.performed_by || ''}
                                                                onChange={e => updateMaintenanceEntry(index, 'performed_by', e.target.value)}
                                                            >
                                                                <option value="">Select Employee</option>
                                                                {employees.map(employee => (
                                                                    <option key={employee.id} value={employee.id}>
                                                                        {employee.full_name} ({employee.employee_no})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => removeMaintenanceEntry(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-muted text-center py-3 border rounded">
                                        No maintenance history entries. Click "Add Entry" to add one.
                                    </div>
                                )}
                                {errors.maintenance_history && (
                                    <div className="invalid-feedback d-block">
                                        {errors.maintenance_history}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label htmlFor="comments_history" className="form-label mb-0">Comments History</label>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={addComment}
                                    >
                                        + Add Comment
                                    </button>
                                </div>
                                {data.comments_history.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '20%' }}>Date</th>
                                                    <th style={{ width: '70%' }}>Comment</th>
                                                    <th style={{ width: '10%' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.comments_history.map((comment, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                value={comment.date || ''}
                                                                onChange={e => updateComment(index, 'date', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={comment.comment || ''}
                                                                onChange={e => updateComment(index, 'comment', e.target.value)}
                                                                placeholder="Enter comment"
                                                            />
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => removeComment(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-muted text-center py-3 border rounded">
                                        No comments. Click "Add Comment" to add one.
                                    </div>
                                )}
                                {errors.comments_history && (
                                    <div className="invalid-feedback d-block">
                                        {errors.comments_history}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label htmlFor="notes" className="form-label mb-0">Notes</label>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={addNote}
                                    >
                                        + Add Note
                                    </button>
                                </div>
                                {data.notes.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '20%' }}>Date</th>
                                                    <th style={{ width: '70%' }}>Note</th>
                                                    <th style={{ width: '10%' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.notes.map((note, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                value={note.date || ''}
                                                                onChange={e => updateNote(index, 'date', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={note.note || ''}
                                                                onChange={e => updateNote(index, 'note', e.target.value)}
                                                                placeholder="Enter note"
                                                            />
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => removeNote(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-muted text-center py-3 border rounded">
                                        No notes. Click "Add Note" to add one.
                                    </div>
                                )}
                                {errors.notes && (
                                    <div className="invalid-feedback d-block">
                                        {errors.notes}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="documents" className="form-label">Documents</label>
                                <input
                                    type="file"
                                    className={`form-control ${errors.documents ? 'is-invalid' : ''}`}
                                    id="documents"
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                    onChange={handleDocumentChange}
                                />
                                <small className="form-text text-muted">
                                    Upload invoices, warranties, manuals, or other related documents (PDF, DOC, DOCX, JPG, PNG, TXT)
                                </small>
                                {data.documents.length > 0 && (
                                    <div className="mt-3">
                                        <h6 className="mb-2">Selected Documents:</h6>
                                        <ul className="list-group">
                                            {data.documents.map((file, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span>
                                                        📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeDocument(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {errors.documents && (
                                    <div className="invalid-feedback d-block">
                                        {errors.documents}
                                    </div>
                                )}
                            </div>
                            
                            <div className="d-flex justify-content-between">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Creating...' : 'Create Asset'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={() => reset()}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

