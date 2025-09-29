import { Head, Link, useForm } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        birth_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employees.store'), {
            onSuccess: () => {
                // Form will redirect to employees.index automatically
                // The redirect is handled in the controller
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Asset Register" />
            <main className="d-flex justify-content-center align-items-center flex-column vh-100">
                <form className="w-50 border border-black rounded-5 p-5" onSubmit={handleSubmit}>
                    <p className="fw-bold fs-3">Asset Register</p>
                    
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                            id="first_name" 
                            placeholder="John"
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
                    
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                            id="last_name" 
                            placeholder="Doe"
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
                    
                    <div className="d-flex justify-content-between">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                        <Link 
                            href={route('employees.index')} 
                            className="btn btn-outline-secondary"
                        >
                            View All Employees
                        </Link>
                    </div>
                </form>
                <footer className="py-16 text-center text-sm text-black dark:text-white/70 mt-2">
                    Laravel v{laravelVersion} (PHP v{phpVersion})
                </footer>
            </main>
        </>
    );
}
