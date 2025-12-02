import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'user',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            onSuccess: () => {
                window.location.href = route('users.index');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    return (
        <>
            <Head title="Edit User" />
            <Header activePage="users" />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Edit User</h1>
                    <Link 
                        href={route('users.index')} 
                        className="btn btn-secondary"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">User Information</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password (leave blank to keep current)</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                        />
                                        {errors.password_confirmation && (
                                            <div className="invalid-feedback">
                                                {errors.password_confirmation}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Role</label>
                                <select 
                                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                                    id="role"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="user">User</option>
                                    <option value="encoder">Encoder</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && (
                                    <div className="invalid-feedback">
                                        {errors.role}
                                    </div>
                                )}
                            </div>
                            
                            <div className="d-flex justify-content-between">
                                <button 
                                    type="submit" 
                                    className="btn btn-success"
                                    disabled={processing}
                                >
                                    {processing ? 'Updating...' : 'Update User'}
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

