import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import Header from '@/Components/Header';

export default function Index({ users, flash }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (userId, userName) => {
        if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            destroy(route('users.destroy', userId));
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
                    <h1>User Management</h1>
                    <Link href={route('users.create')} className="btn btn-danger">
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
                                    <th>ID</th>
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
                                        <td>{user.id}</td>
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
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)}
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
            </div>
        </>
    );
}

