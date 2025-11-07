import { Head, Link } from '@inertiajs/react';
import moment from 'moment';

export default function Show({ asset }) {
    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'In-use': 'bg-success',
            'Spare': 'bg-info',
            'Under Maintenance': 'bg-warning',
            'Retired': 'bg-secondary'
        };
        return statusClasses[status] || 'bg-secondary';
    };

    return (
        <>
            <Head title={`Asset - ${asset.asset_id}`} />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Asset Details</h1>
                    <div>
                        <Link 
                            href={route('assets.edit', asset.id)} 
                            className="btn btn-outline-primary me-2"
                        >
                            Edit Asset
                        </Link>
                        <Link 
                            href={route('assets.index')} 
                            className="btn btn-secondary"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Asset Information</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Asset ID:</label>
                                    <p className="form-control-plaintext"><strong>{asset.asset_id}</strong></p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Status:</label>
                                    <p className="form-control-plaintext">
                                        <span className={`badge ${getStatusBadgeClass(asset.status)}`}>
                                            {asset.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Asset Category:</label>
                                    <p className="form-control-plaintext">{asset.asset_category}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Brand / Manufacturer:</label>
                                    <p className="form-control-plaintext">{asset.brand_manufacturer}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Model Number:</label>
                                    <p className="form-control-plaintext">{asset.model_number}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Serial Number:</label>
                                    <p className="form-control-plaintext">{asset.serial_number}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Purchase Date:</label>
                                    <p className="form-control-plaintext">{moment(asset.purchase_date).format('DD/MM/YYYY')}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Vendor / Supplier:</label>
                                    <p className="form-control-plaintext">{asset.vendor_supplier || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Warranty Expiry Date:</label>
                                    <p className="form-control-plaintext">
                                        {asset.warranty_expiry_date ? moment(asset.warranty_expiry_date).format('DD/MM/YYYY') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Assigned To:</label>
                                    <p className="form-control-plaintext">
                                        {(() => {
                                            const employee = asset.assignedEmployee || asset.assigned_employee;
                                            return employee ? (
                                                <span>{employee.employee_no}</span>
                                            ) : (
                                                <span className="text-muted">Unassigned</span>
                                            );
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {asset.maintenance_history && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Maintenance History:</label>
                                        <div className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                                            {asset.maintenance_history}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <hr />

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Created At:</label>
                                    <p className="form-control-plaintext">{moment(asset.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Updated At:</label>
                                    <p className="form-control-plaintext">{moment(asset.updated_at).format('DD/MM/YYYY HH:mm')}</p>
                                </div>
                            </div>
                        </div>

                        {asset.creator && (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Created By:</label>
                                        <p className="form-control-plaintext">{asset.creator.name || 'Unknown User'}</p>
                                    </div>
                                </div>
                                {asset.updater && (
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Last Updated By:</label>
                                            <p className="form-control-plaintext">{asset.updater.name || 'Unknown User'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

