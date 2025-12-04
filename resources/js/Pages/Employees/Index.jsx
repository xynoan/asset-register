import { Head, Link, useForm, usePage } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlus, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '@/Components/Header';

export default function Index({ employees, flash }) {
    const { delete: destroy, processing } = useForm();
    const user = usePage().props?.auth?.user;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const handleDelete = (employeeId, employeeName) => {
        setEmployeeToDelete({ id: employeeId, name: employeeName });
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (employeeToDelete) {
            destroy(route('employees.destroy', employeeToDelete.id));
        }
    };

    return (
        <>
            <Head title="Employees" />
            <Header activePage="employees" />
            <div className="container mt-5">
                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1><FontAwesomeIcon icon={faUsers} className="me-2" />Employees</h1>
                    {user?.role !== 'user' && (
                        <Link href={route('employees.create')} className="btn btn-danger">
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Add New Employee
                        </Link>
                    )}
                </div>

                {employees.data.length === 0 ? (
                    <div className="alert alert-info">
                        No employees found.
                        {user?.role !== 'user' && (
                            <> <Link href={route('employees.create')}>Add the first employee</Link>.</>
                        )}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Employee No</th>
                                    <th>Full Name</th>
                                    <th>Birth Date</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.data.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.employee_no}</td>
                                        <td>{employee.full_name}</td>
                                        <td>{moment(employee.birth_date).format('DD/MM/YYYY')}</td>
                                        <td>
                                            <span className={`badge ${employee.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td>{moment(employee.created_at).format('DD/MM/YYYY')}</td>
                                        <td>
                                            <Link
                                                href={route('employees.show', employee.id)}
                                                className="btn btn-sm btn-outline-success me-2"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="me-1" />
                                                View
                                            </Link>
                                            {user?.role !== 'user' && (
                                                <>
                                                    <Link
                                                        href={route('employees.edit', employee.id)}
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} className="me-1" />
                                                        Edit
                                                    </Link>
                                                    {user?.role !== 'encoder' && (
                                                        <button
                                                            onClick={() => handleDelete(employee.id, employee.full_name)}
                                                            className="btn btn-sm btn-outline-danger"
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {employees.links && (
                    <div>
                        <nav>
                            <ul className="pagination">
                                {employees.links.map((link, idx) => (
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
                                <p>Are you sure you want to delete employee <strong>"{employeeToDelete?.name}"</strong>?</p>
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
