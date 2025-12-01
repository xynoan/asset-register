import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import Header from '@/Components/Header';

export default function Index({ employees, flash }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (employeeId, employeeName) => {
        if (confirm(`Are you sure you want to delete employee "${employeeName}"? This action cannot be undone.`)) {
            destroy(route('employees.destroy', employeeId));
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
                    <h1>Employees</h1>
                    <Link href={route('employees.create')} className="btn btn-danger">
                        Add New Employee
                    </Link>
                </div>

                {employees.data.length === 0 ? (
                    <div className="alert alert-info">
                        No employees found. <Link href={route('employees.create')}>Add the first employee</Link>.
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
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route('employees.edit', employee.id)}
                                                className="btn btn-sm btn-outline-secondary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(employee.id, employee.full_name)}
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
            </div>
        </>
    );
}
