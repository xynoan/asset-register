import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '@/Components/Header';

export default function Index({ users, flash }) {
    const { delete: destroy, processing } = useForm();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleDelete = (userId, userName) => {
        setUserToDelete({ id: userId, name: userName });
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            destroy(route('users.destroy', userToDelete.id));
        }
    };

    const getRoleBadgeClass = (role) => {
        const roleClasses = {
            'admin': 'bg-danger',
            'user': 'bg-primary',
            'encoder': 'bg-info'
        };
        return roleClasses[role] || 'bg-secondary';
    };

    return (
        <>
            <Head title="Users" />
            <Header activePage="users" />
            <div className="container mt-5">
                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                {flash?.error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {flash.error}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1><FontAwesomeIcon icon={faUser} className="me-2" />User Management</h1>
                    <Link href={route('users.create')} className="btn btn-danger">
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Add New User
                    </Link>
                </div>

                {users.length === 0 ? (
                    <div className="alert alert-info">
                        No users found. <Link href={route('users.create')}>Add the first user</Link>.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td>{moment(user.created_at).format('DD/MM/YYYY HH:mm')}</td>
                                        <td>
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="me-1" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="btn btn-sm btn-outline-danger"
                                                disabled={processing}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="me-1" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                <p>Are you sure you want to delete user <strong>"{userToDelete?.name}"</strong>?</p>
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

