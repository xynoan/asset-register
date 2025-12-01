import { Head, Link } from '@inertiajs/react';
import moment from 'moment';
import Header from '@/Components/Header';

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

    // Parse document_paths - handle both string (JSON) and array formats
    const parseDocumentPaths = () => {
        if (!asset.document_paths) return [];
        if (Array.isArray(asset.document_paths)) {
            return asset.document_paths.map(doc => {
                // Handle new format: {path: "...", original_name: "..."}
                if (typeof doc === 'object' && doc !== null && doc.original_name) {
                    return doc;
                }
                // Handle old format: just a string path
                if (typeof doc === 'string') {
                    return {
                        path: doc,
                        original_name: doc.split('/').pop() || 'Unknown'
                    };
                }
                return { path: '', original_name: 'Unknown' };
            });
        }
        return [];
    };

    // Parse comments_history - handle both string (JSON) and array formats
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

    // Parse notes - handle both string (JSON) and array formats
    const parseNotes = () => {
        if (!asset.notes) return [];
        if (Array.isArray(asset.notes)) return asset.notes;
        try {
            const parsed = JSON.parse(asset.notes);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    // Parse modification_history - handle both string (JSON) and array formats
    const parseModificationHistory = () => {
        if (!asset.modification_history) return [];
        if (Array.isArray(asset.modification_history)) return asset.modification_history;
        try {
            const parsed = JSON.parse(asset.modification_history);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    // Parse assignment_history - handle both string (JSON) and array formats
    const parseAssignmentHistory = () => {
        if (!asset.assignment_history) return [];
        if (Array.isArray(asset.assignment_history)) return asset.assignment_history;
        try {
            const parsed = JSON.parse(asset.assignment_history);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    const maintenanceHistory = parseMaintenanceHistory();
    const documentPaths = parseDocumentPaths();
    const documentUrls = asset.document_urls || [];
    const commentsHistory = parseCommentsHistory();
    const notes = parseNotes();
    const modificationHistory = parseModificationHistory();
    const assignmentHistory = parseAssignmentHistory();

    // Helper function to get file name from path
    const getFileName = (path) => {
        if (!path) return 'Unknown';
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    // Helper function to get file icon based on extension
    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        const iconMap = {
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'txt': '📃',
        };
        return iconMap[ext] || '📎';
    };

    return (
        <>
            <Head title={`Asset - ${asset.asset_id}`} />
            <Header activePage="assets" />
            <div className="container my-5">
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
                                        {asset.status_duration_string && (
                                            <small className="ms-2 text-muted">
                                                ({asset.status_duration_string})
                                            </small>
                                        )}
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
                                                <span>{asset.assigned_employee.full_name}</span>
                                            ) : (
                                                <span className="text-danger">Unassigned</span>
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

                        {documentPaths.length > 0 && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Documents:</label>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '10%' }}>Icon</th>
                                                        <th style={{ width: '60%' }}>File Name</th>
                                                        <th style={{ width: '30%' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {documentPaths.map((doc, index) => {
                                                        const fileName = doc.original_name || (typeof doc === 'string' ? doc.split('/').pop() : 'Unknown');
                                                        const filePath = typeof doc === 'object' && doc.path ? doc.path : doc;
                                                        const fileUrl = documentUrls[index] || `/storage/${filePath}`;
                                                        return (
                                                            <tr key={index}>
                                                                <td className="text-center">{getFileIcon(fileName)}</td>
                                                                <td>{fileName}</td>
                                                                <td>
                                                                    <a
                                                                        href={fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-sm btn-outline-primary"
                                                                    >
                                                                        View / Download
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
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
                                        <label className="form-label fw-bold">Comments History:</label>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '15%' }}>Date</th>
                                                        <th style={{ width: '60%' }}>Comment</th>
                                                        <th style={{ width: '25%' }}>Added By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsHistory.map((comment, index) => (
                                                        <tr key={index}>
                                                            <td>{comment.date ? moment(comment.date).format('DD/MM/YYYY') : 'N/A'}</td>
                                                            <td>{comment.comment || 'N/A'}</td>
                                                            <td>{comment.added_by || 'System'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {notes.length > 0 && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Notes:</label>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '15%' }}>Date</th>
                                                        <th style={{ width: '60%' }}>Note</th>
                                                        <th style={{ width: '25%' }}>Added By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {notes.map((note, index) => (
                                                        <tr key={index}>
                                                            <td>{note.date ? moment(note.date).format('DD/MM/YYYY') : 'N/A'}</td>
                                                            <td>{note.note || 'N/A'}</td>
                                                            <td>{note.added_by || 'System'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {assignmentHistory.length > 0 && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Assignment History:</label>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '15%' }}>Date & Time</th>
                                                        <th style={{ width: '20%' }}>Assigned To</th>
                                                        <th style={{ width: '15%' }}>Employee No</th>
                                                        <th style={{ width: '20%' }}>Status</th>
                                                        <th style={{ width: '30%' }}>Assigned By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[...assignmentHistory].reverse().map((entry, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {entry.assigned_at ? moment.utc(entry.assigned_at).local().format('DD/MM/YYYY HH:mm') : 'N/A'}
                                                            </td>
                                                            <td>
                                                                {entry.employee_name ? (
                                                                    <span>{entry.employee_name}</span>
                                                                ) : (
                                                                    <span className="text-danger">Unassigned</span>
                                                                )}
                                                            </td>
                                                            <td>{entry.employee_no || '—'}</td>
                                                            <td>
                                                                {entry.status ? (
                                                                    <span className={`badge ${getStatusBadgeClass(entry.status)}`}>
                                                                        {entry.status}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted">—</span>
                                                                )}
                                                            </td>
                                                            <td>{entry.assigned_by || 'System'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* {modificationHistory.length > 0 && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Modification History:</label>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: '15%' }}>Date & Time</th>
                                                        <th style={{ width: '20%' }}>Modified By</th>
                                                        <th style={{ width: '65%' }}>Changes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {modificationHistory.map((entry, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {entry.timestamp ? moment.utc(entry.timestamp).local().format('DD/MM/YYYY HH:mm') : 
                                                                 entry.date ? moment(entry.date).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                                            </td>
                                                            <td>{entry.modified_by || 'System'}</td>
                                                            <td>
                                                                {entry.changes && Array.isArray(entry.changes) && entry.changes.length > 0 ? (
                                                                    <ul className="mb-0" style={{ paddingLeft: '20px' }}>
                                                                        {entry.changes.map((change, changeIndex) => (
                                                                            <li key={changeIndex} style={{ marginBottom: '4px' }}>
                                                                                <strong>{change.field}:</strong>{' '}
                                                                                <span className="text-danger">
                                                                                    {change.old_value === null ? '(empty)' : String(change.old_value)}
                                                                                </span>
                                                                                {' → '}
                                                                                <span className="text-success">
                                                                                    {change.new_value === null ? '(empty)' : String(change.new_value)}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <span className="text-muted">No changes recorded</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )} */}

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

