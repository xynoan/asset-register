import { Head, Link } from '@inertiajs/react';

export default function Index({ employees }) {
    return (
        <>
            <Head title="Employees" />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Employees</h1>
                    {/* <Link href={route('employees.create')} className="btn btn-primary">
                        Add New Employee
                    </Link> */}
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
                                        <td>{new Date(employee.birth_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${employee.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td>{new Date(employee.created_at).toLocaleDateString()}</td>
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
                                            <Link 
                                                href={route('employees.edit', employee.id)} 
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {employees.links && (
                    <div className="d-flex justify-content-center">
                        {/* Pagination links */}
                    </div>
                )}

                <div className="mt-4">
                    <Link href="/" className="btn btn-secondary">
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}
