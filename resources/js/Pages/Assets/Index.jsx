import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';

export default function Index({ assets, flash }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (assetId, assetName) => {
        if (confirm(`Are you sure you want to delete asset "${assetName}"? This action cannot be undone.`)) {
            destroy(route('assets.destroy', assetId));
        }
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

    return (
        <>
            <Head title="Assets" />
            <div className="container mt-5">
                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Assets</h1>
                    <Link href={route('assets.create')} className="btn btn-primary">
                        Add New Asset
                    </Link>
                </div>

                {assets.data.length === 0 ? (
                    <div className="alert alert-info">
                        No assets found. <Link href={route('assets.create')}>Add the first asset</Link>.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Category</th>
                                    <th>Brand / Manufacturer</th>
                                    <th>Model Number</th>
                                    <th>Serial Number</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Purchase Date</th>
                                    <th>Attachments</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.data.map((asset) => (
                                    <tr key={asset.id}>
                                        <td><strong>{asset.asset_id}</strong></td>
                                        <td>{asset.asset_category}</td>
                                        <td>{asset.brand_manufacturer}</td>
                                        <td>{asset.model_number}</td>
                                        <td>{asset.serial_number}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(asset.status)}`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td>
                                            {
                                                asset.assigned_employee ? (
                                                    <span>{asset.assigned_employee.employee_no}</span>
                                                ) : (
                                                    <span className="text-muted">Unassigned</span>
                                                )
                                            }
                                        </td>
                                        <td>{moment(asset.purchase_date).format('DD/MM/YYYY')}</td>
                                        <td>
                                            {asset.document_count > 0 ? (
                                                <Link
                                                    href={route('assets.show', asset.id)}
                                                    className="badge bg-info text-decoration-none"
                                                    title="Click to view attachments"
                                                >
                                                    📎 {asset.document_count}
                                                </Link>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td>
                                            <Link
                                                href={route('assets.show', asset.id)}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route('assets.edit', asset.id)}
                                                className="btn btn-sm btn-outline-secondary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(asset.id, asset.asset_id)}
                                                className="btn btn-sm btn-outline-danger"
                                                disabled={processing}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {assets.links && (
                    <div>
                        <nav>
                            <ul className="pagination">
                                {assets.links.map((link, idx) => (
                                    <li
                                        key={idx}
                                        className={`page-item${link.active ? ' active' : ''}${!link.url ? ' disabled' : ''}`}
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className="page-link"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                className="page-link"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
}

