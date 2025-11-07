import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ employees }) {
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
        assigned_to: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assets.store'), {
            transform: (data) => ({
                ...data,
                maintenance_history: data.maintenance_history.length > 0 
                    ? JSON.stringify(data.maintenance_history) 
                    : ''
            }),
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
    };

    const updateMaintenanceEntry = (index, field, value) => {
        const updated = [...data.maintenance_history];
        updated[index] = { ...updated[index], [field]: value };
        setData('maintenance_history', updated);
    };

    const assetCategories = [
        'Keyboard',
        'Mouse',
        'Monitor',
        'Printer',
        'Scanner',
        'Headset',
        'Webcam',
        'Speakers',
        'Hard Drive',
        'SSD',
        'USB Drive',
        'Other'
    ];

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
                                        <label htmlFor="asset_category" className="form-label">Asset Category *</label>
                                        <select
                                            className={`form-select ${errors.asset_category ? 'is-invalid' : ''}`}
                                            id="asset_category"
                                            value={data.asset_category}
                                            onChange={e => setData('asset_category', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {assetCategories.map(category => (
                                                <option key={category} value={category}>{category}</option>
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
                                        <label htmlFor="brand_manufacturer" className="form-label">Brand / Manufacturer *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.brand_manufacturer ? 'is-invalid' : ''}`}
                                            id="brand_manufacturer"
                                            value={data.brand_manufacturer}
                                            onChange={e => setData('brand_manufacturer', e.target.value)}
                                            required
                                        />
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
                                        <label htmlFor="model_number" className="form-label">Model Number *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.model_number ? 'is-invalid' : ''}`}
                                            id="model_number"
                                            value={data.model_number}
                                            onChange={e => setData('model_number', e.target.value)}
                                            required
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
                                        <label htmlFor="serial_number" className="form-label">Serial Number *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.serial_number ? 'is-invalid' : ''}`}
                                            id="serial_number"
                                            value={data.serial_number}
                                            onChange={e => setData('serial_number', e.target.value)}
                                            required
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
                                        <label htmlFor="purchase_date" className="form-label">Purchase Date *</label>
                                        <input 
                                            type="date" 
                                            className={`form-control ${errors.purchase_date ? 'is-invalid' : ''}`}
                                            id="purchase_date"
                                            value={data.purchase_date}
                                            onChange={e => setData('purchase_date', e.target.value)}
                                            required
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
                                        <label htmlFor="vendor_supplier" className="form-label">Vendor / Supplier</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.vendor_supplier ? 'is-invalid' : ''}`}
                                            id="vendor_supplier"
                                            value={data.vendor_supplier}
                                            onChange={e => setData('vendor_supplier', e.target.value)}
                                        />
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
                                        <label htmlFor="status" className="form-label">Status *</label>
                                        <select
                                            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                            id="status"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            required
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
                                                                className="form-control form-control-sm"
                                                                value={entry.cost || ''}
                                                                onChange={e => updateMaintenanceEntry(index, 'cost', e.target.value)}
                                                                placeholder="Cost"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={entry.performed_by || ''}
                                                                onChange={e => updateMaintenanceEntry(index, 'performed_by', e.target.value)}
                                                                placeholder="Technician name"
                                                            />
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

