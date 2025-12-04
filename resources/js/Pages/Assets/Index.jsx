import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus, faEye, faEdit, faTrash, faChevronDown, faChevronUp, faComment, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Header from '@/Components/Header';

export default function Index({ assets, flash }) {
    const { delete: destroy, processing } = useForm();
    const { auth } = usePage().props;
    const [commentInputs, setCommentInputs] = useState({});
    const [submitting, setSubmitting] = useState({});
    const [expandedRows, setExpandedRows] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);

    const handleDelete = (assetId, assetName) => {
        setAssetToDelete({ id: assetId, name: assetName });
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setAssetToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (assetToDelete) {
            destroy(route('assets.destroy', assetToDelete.id));
        }
    };

    const handleCommentChange = (assetId, value) => {
        setCommentInputs(prev => ({ ...prev, [assetId]: value }));
    };

    const handleCommentSubmit = (assetId, e) => {
        e.preventDefault();
        const comment = commentInputs[assetId]?.trim();
        if (!comment || submitting[assetId]) return;

        setSubmitting(prev => ({ ...prev, [assetId]: true }));

        router.post(route('assets.comments', assetId), { comment }, {
            preserveScroll: true,
            onFinish: () => {
                setSubmitting(prev => ({ ...prev, [assetId]: false }));
                setCommentInputs(prev => ({ ...prev, [assetId]: '' }));
            },
        });
    };

    const toggleRow = (assetId) => {
        setExpandedRows(prev => ({ ...prev, [assetId]: !prev[assetId] }));
    };

    const hasComments = (asset) => {
        if (!asset.comments_history) return false;
        let commentsHistory = [];
        if (Array.isArray(asset.comments_history)) {
            commentsHistory = asset.comments_history;
        } else if (typeof asset.comments_history === 'string') {
            try {
                const parsed = JSON.parse(asset.comments_history);
                commentsHistory = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                commentsHistory = [];
            }
        }
        return commentsHistory.length > 0;
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
            <Header activePage="assets" />

            <div className="container mt-5">
                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1><FontAwesomeIcon icon={faBox} className="me-2" />Assets</h1>
                    {auth?.user?.role !== 'user' && (
                        <Link href={route('assets.create')} className="btn btn-danger">
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Add New Asset
                        </Link>
                    )}
                </div>

                {assets.data.length === 0 ? (
                    <div className="alert alert-info">
                        No assets found.
                        {auth?.user?.role !== 'user' && (
                            <> <Link href={route('assets.create')}>Add the first asset</Link>.</>
                        )}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th style={{ width: '30px' }}></th>
                                    <th>Asset ID</th>
                                    <th>Category</th>
                                    <th>Brand / Manufacturer</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Status Duration</th>
                                    {auth?.user?.role === 'admin' && <th>Last Modified</th>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.data.map((asset) => (
                                    <>
                                        <tr key={asset.id}>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0 text-danger"
                                                    onClick={() => toggleRow(asset.id)}
                                                    title={expandedRows[asset.id] ? 'Hide comment' : hasComments(asset) ? 'View comments' : 'Add comment'}
                                                >
                                                    {expandedRows[asset.id] ? (
                                                        <FontAwesomeIcon icon={faChevronUp} />
                                                    ) : (
                                                        <FontAwesomeIcon icon={hasComments(asset) ? faCommentDots : faComment} className={hasComments(asset) ? "text-danger" : ""} />
                                                    )}
                                                </button>
                                            </td>
                                            <td><strong>{asset.asset_id}</strong></td>
                                            <td>{asset.asset_category}</td>
                                            <td>{asset.brand_manufacturer}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(asset.status)}`}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td>
                                                {
                                                    asset.assigned_employee ? (
                                                        <span>{asset.assigned_employee.full_name}</span>
                                                    ) : (
                                                        <span className="text-danger">Unassigned</span>
                                                    )
                                                }
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {asset.status_duration_string || 'Unknown'}
                                                </small>
                                            </td>
                                            {auth?.user?.role === 'admin' && (
                                                <td>
                                                    <small className="text-muted">
                                                        {asset.updated_at ? moment(asset.updated_at).format('DD/MM/YYYY') : 'N/A'}
                                                        {asset.updater && (
                                                            <>
                                                                <br />
                                                                <span className="text-muted" style={{ fontSize: '0.85em' }}>
                                                                    by {asset.updater.name || 'System'}
                                                                </span>
                                                            </>
                                                        )}
                                                    </small>
                                                </td>
                                            )}
                                            <td>
                                                <Link
                                                    href={route('assets.show', asset.id)}
                                                    className="btn btn-sm btn-outline-success me-2 my-1"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="me-1" />
                                                    View
                                                </Link>
                                                {auth?.user?.role !== 'user' && (
                                                    <>
                                                        <Link
                                                            href={route('assets.edit', asset.id)}
                                                            className="btn btn-sm btn-outline-primary me-2 my-1"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                                                            Edit
                                                        </Link>
                                                        {auth?.user?.role !== 'encoder' && (
                                                            <button
                                                                onClick={() => handleDelete(asset.id, asset.asset_id)}
                                                                className="btn btn-sm btn-outline-danger my-1"
                                                                disabled={processing}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="me-1" />
                                                                Delete
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                        {expandedRows[asset.id] && (
                                            <tr key={`${asset.id}-comment`}>
                                                <td colSpan={auth?.user?.role === 'admin' ? 9 : 8} className="bg-light">
                                                    <div className="p-3">
                                                        {/* Parse and display assignment history */}
                                                        {(() => {
                                                            let assignmentHistory = [];
                                                            if (asset.assignment_history) {
                                                                if (Array.isArray(asset.assignment_history)) {
                                                                    assignmentHistory = asset.assignment_history;
                                                                } else if (typeof asset.assignment_history === 'string') {
                                                                    try {
                                                                        const parsed = JSON.parse(asset.assignment_history);
                                                                        assignmentHistory = Array.isArray(parsed) ? parsed : [];
                                                                    } catch (e) {
                                                                        assignmentHistory = [];
                                                                    }
                                                                }
                                                            }
                                                            // Reverse to show newest assignments first
                                                            const reversedAssignments = [...assignmentHistory].reverse();
                                                            return reversedAssignments.length > 0 ? (
                                                                <div className="mb-3">
                                                                    <h6 className="mb-2">Assignment History</h6>
                                                                    <div className="table-responsive">
                                                                        <table className="table table-bordered table-sm mb-3">
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
                                                                                {reversedAssignments.map((entry, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{entry.assigned_at ? moment(entry.assigned_at).format('DD/MM/YYYY HH:mm') : 'N/A'}</td>
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
                                                            ) : null;
                                                        })()}

                                                        {/* Parse and display existing comments */}
                                                        {(() => {
                                                            let commentsHistory = [];
                                                            if (asset.comments_history) {
                                                                if (Array.isArray(asset.comments_history)) {
                                                                    commentsHistory = asset.comments_history;
                                                                } else if (typeof asset.comments_history === 'string') {
                                                                    try {
                                                                        const parsed = JSON.parse(asset.comments_history);
                                                                        commentsHistory = Array.isArray(parsed) ? parsed : [];
                                                                    } catch (e) {
                                                                        commentsHistory = [];
                                                                    }
                                                                }
                                                            }
                                                            // Reverse to show newest comments first
                                                            const reversedComments = [...commentsHistory].reverse();
                                                            return reversedComments.length > 0 ? (
                                                                <div className="mb-3">
                                                                    <h6 className="mb-2">Comments</h6>
                                                                    <div className="table-responsive">
                                                                        <table className="table table-bordered table-sm mb-3">
                                                                            <thead className="table-light">
                                                                                <tr>
                                                                                    <th style={{ width: '15%' }}>Date</th>
                                                                                    <th style={{ width: '60%' }}>Comment</th>
                                                                                    <th style={{ width: '25%' }}>Added By</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {reversedComments.map((entry, index) => (
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
                                                            ) : null;
                                                        })()}

                                                        {auth?.user?.role !== 'user' && (
                                                            <>
                                                                <h6 className="mb-2">Add Comment</h6>
                                                                <form onSubmit={(e) => handleCommentSubmit(asset.id, e)}>
                                                                    <div className="mb-2">
                                                                        <textarea
                                                                            className="form-control"
                                                                            rows="2"
                                                                            placeholder="Enter your comment..."
                                                                            value={commentInputs[asset.id] || ''}
                                                                            onChange={(e) => handleCommentChange(asset.id, e.target.value)}
                                                                        />
                                                                        <small className="text-muted">
                                                                            Comment will be attributed to: {auth?.user?.name || 'System'}
                                                                        </small>
                                                                    </div>
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-sm btn-danger"
                                                                        disabled={!commentInputs[asset.id]?.trim() || submitting[asset.id]}
                                                                    >
                                                                        <FontAwesomeIcon icon={faCommentDots} className="me-2" />
                                                                        {submitting[asset.id] ? 'Submitting...' : 'Add Comment'}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-secondary ms-2"
                                                                        onClick={() => toggleRow(asset.id)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </form>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
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
                                                className="page-link text-white bg-danger border-danger"
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

                {/* Delete Modal */}
                <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal} disabled={processing}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete asset <strong>"{assetToDelete?.name}"</strong>?</p>
                                <p className="text-danger mb-0">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal} disabled={processing}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={processing}>
                                    {processing ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showDeleteModal && <div className="modal-backdrop fade show"></div>}
            </div>
        </>
    );
}