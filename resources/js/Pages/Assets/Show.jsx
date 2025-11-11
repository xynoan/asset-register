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

    // Parse maintenance_history - handle both string (JSON) and array formats
    const parseMaintenanceHistory = () => {
        if (!asset.maintenance_history) return [];
        if (Array.isArray(asset.maintenance_history)) return asset.maintenance_history;
        try {
            const parsed = JSON.parse(asset.maintenance_history);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    // Parse comments_history - should already be an array due to model cast, but handle string just in case
    const parseCommentsHistory = () => {
        if (!asset.comments_history) return [];
        if (Array.isArray(asset.comments_history)) return asset.comments_history;
        try {
            const parsed = JSON.parse(asset.comments_history);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    const maintenanceHistory = parseMaintenanceHistory();
    const commentsHistory = parseCommentsHistory();

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
                                        {
                                            asset.assigned_employee ? (
                                                <span>{asset.assigned_employee.full_name} ({asset.assigned_employee.employee_no})</span>
                                            ) : (
                                                <span className="text-muted">Unassigned</span>
                                            )
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {maintenanceHistory.length > 0 && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Maintenance History:</label>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '15%' }}>Date</th>
                                                        <th style={{ width: '40%' }}>Description</th>
                                                        <th style={{ width: '15%' }}>Cost</th>
                                                        <th style={{ width: '30%' }}>Performed By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {maintenanceHistory.map((entry, index) => (
                                                        <tr key={index}>
                                                            <td>{entry.date ? moment(entry.date).format('DD/MM/YYYY') : 'N/A'}</td>
                                                            <td>{entry.description || 'N/A'}</td>
                                                            <td>{entry.cost || 'N/A'}</td>
                                                            <td>{entry.performed_by || 'N/A'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {commentsHistory.length > 0 && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Comments / History:</label>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '15%' }}>Date</th>
                                                        <th style={{ width: '55%' }}>Comment</th>
                                                        <th style={{ width: '30%' }}>Added By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsHistory.map((entry, index) => (
                                                        <tr key={index}>
                                                            <td>{entry.date ? moment(entry.date).format('DD/MM/YYYY') : 'N/A'}</td>
                                                            <td>{entry.comment || 'N/A'}</td>
                                                            <td>{entry.added_by || 'N/A'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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

