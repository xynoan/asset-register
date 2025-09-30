import { Head, Link } from '@inertiajs/react';
import moment from 'moment';

export default function Show({ employee }) {
    return (
        <>
            <Head title={`Employee - ${employee.full_name}`} />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Employee Details</h1>
                    <div>
                        <Link 
                            href={route('employees.edit', employee.id)} 
                            className="btn btn-outline-primary me-2"
                        >
                            Edit Employee
                        </Link>
                        <Link 
                            href={route('employees.index')} 
                            className="btn btn-secondary"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Employee Information</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Employee Number:</label>
                                    <p className="form-control-plaintext">{employee.employee_no}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Status:</label>
                                    <p className="form-control-plaintext">
                                        <span className={`badge ${employee.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                            {employee.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Full Name:</label>
                                    <p className="form-control-plaintext">{employee.full_name}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Birth Date:</label>
                                    <p className="form-control-plaintext">{moment(employee.birth_date).format('DD/MM/YYYY')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Created At:</label>
                                    <p className="form-control-plaintext">{moment(employee.created_at).format('DD/MM/YYYY HH:mm')}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Updated At:</label>
                                    <p className="form-control-plaintext">{moment(employee.updated_at).format('DD/MM/YYYY HH:mm')}</p>
                                </div>
                            </div>
                        </div>

                        {employee.creator && (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Created By:</label>
                                        <p className="form-control-plaintext">{employee.creator.name || 'Unknown User'}</p>
                                    </div>
                                </div>
                                {employee.updater && (
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Last Updated By:</label>
                                            <p className="form-control-plaintext">{employee.updater.name || 'Unknown User'}</p>
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
