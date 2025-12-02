import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        birth_date: '',
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employees.store'), {
            onSuccess: () => {
                window.location.href = route('employees.index');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    return (
        <>
            <Head title="Add New Employee" />
            <Header activePage="employees" />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Add New Employee</h1>
                    <Link 
                        href={route('employees.index')} 
                        className="btn btn-secondary"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Employee Information</h5>
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
                                    value={data.birth_date}
                                    onChange={e => setData('birth_date', e.target.value)}
                                    required
                                />
                                {errors.birth_date && (
                                    <div className="invalid-feedback">
                                        {errors.birth_date}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select 
                                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                    id="status"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                {errors.status && (
                                    <div className="invalid-feedback">
                                        {errors.status}
                                    </div>
                                )}
                            </div>
                            
                            <div className="d-flex justify-content-between">
                                <button 
                                    type="submit" 
                                    className="btn btn-success"
                                    disabled={processing}
                                >
                                    {processing ? 'Creating...' : 'Create Employee'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-danger"
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
