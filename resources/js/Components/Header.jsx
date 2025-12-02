import { Link, usePage } from '@inertiajs/react';

export default function Header({ activePage = 'assets' }) {
    const user = usePage().props?.auth?.user;

    return (
        <div className="container">
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <div className="col-md-3 mb-2 mb-md-0">
                    <Link href={route('assets.index')} className="d-inline-flex link-body-emphasis text-decoration-none">
                        <img src={route('storage.private', 'kuga_corp_logo-removebg-preview.png')} alt="Logo" className="img-fluid" />
                    </Link>
                </div>

                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li>
                        <Link 
                            href={route('assets.index')} 
                            className={`nav-link px-2 ${activePage === 'assets' ? 'link-secondary' : 'text-danger'}`}
                        >
                            Assets
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href={route('employees.index')} 
                            className={`nav-link px-2 ${activePage === 'employees' ? 'link-secondary' : 'text-danger'}`}
                        >
                            Employees
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href={route('lookups.index')} 
                            className={`nav-link px-2 ${activePage === 'lookups' ? 'link-secondary' : 'text-danger'}`}
                        >
                            Lookups
                        </Link>
                    </li>
                </ul>

                <div className="col-md-3 text-end">
                    {user ? (
                        <div className="d-flex align-items-center justify-content-end">
                            <span className="me-3 text-danger">
                                Hello, <span className="fw-semibold">{user.name || 'Admin'}</span>!
                            </span>
                            <Link
                                as="button"
                                method="post"
                                href={route('logout')}
                                className="btn btn-danger"
                                preserveScroll
                            >
                                Logout
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={route('login')}
                            className="btn btn-outline-danger me-2"
                            style={{ cursor: 'pointer' }}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </header>
        </div>
    );
}

