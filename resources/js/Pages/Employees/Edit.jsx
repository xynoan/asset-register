import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import Header from '@/Components/Header';

export default function Edit({ employee }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        first_name: employee.full_name.split(' ')[0] || '',
        last_name: employee.full_name.split(' ').slice(1).join(' ') || '',
        birth_date: employee.birth_date,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('employees.update', employee.id), {
            onSuccess: () => {
                window.location.href = route('employees.show', employee.id);
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    return (
        <>
            <Head title={`Edit Employee - ${employee.full_name}`} />
            <Header activePage="employees" />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Edit Employee</h1>
                    <div>
                        <Link 
                            href={route('employees.show', employee.id)} 
                            className="btn btn-outline-secondary me-2"
                        >
                            View Employee
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
                        <h5 className="card-title mb-0">Update Employee Information</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            required
                                        />
                                        {errors.first_name && (
                                            <div className="invalid-feedback">
                                                {errors.first_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            required
                                        />
                                        {errors.last_name && (
                                            <div className="invalid-feedback">
                                                {errors.last_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="birth_date" className="form-label">Birth Date</label>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors.birth_date ? 'is-invalid' : ''}`}
                                    id="birth_date"
                                    value={data.birth_date ? moment(data.birth_date).format('YYYY-MM-DD') : ''}
                                    onChange={e => setData('birth_date', e.target.value)}
                                    required
                                />
                                {errors.birth_date && (
                                    <div className="invalid-feedback">
                                        {errors.birth_date}
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-between">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? 'Updating...' : 'Update Employee'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={() => reset()}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
