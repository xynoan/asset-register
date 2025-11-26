import { Link } from '@inertiajs/react';

export default function SectionNavigation() {
    const items = [
        {
            route: 'assets.index',
            activeRoute: 'assets.*',
            label: 'Assets'
        },
        {
            route: 'employees.index',
            activeRoute: 'employees.*',
            label: 'Employees'
        }
    ];

    return (
        <>
            <nav className="mb-4">
                <div 
                    className="bg-white rounded shadow-sm section-nav-container"
                    style={{ 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        padding: '0.375rem',
                        border: '1px solid #dee2e6'
                    }}
                >
                    <ul className="nav nav-pills nav-justified mb-0">
                        {items.map((item, index) => {
                            const isActive = item.activeRoute ? route().current(item.activeRoute) : false;
                            return (
                                <li key={index} className="nav-item">
                                    <Link
                                        href={route(item.route)}
                                        className={`nav-link section-nav-link ${isActive ? 'section-nav-active' : ''}`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
            <style>{`
                .section-nav-link {
                    position: relative;
                    color: #495057 !important;
                    background-color: transparent !important;
                    font-weight: 500;
                    border-radius: 0.5rem;
                    margin: 0 0.125rem;
                    padding: 0.75rem 1rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    overflow: hidden;
                    display: block;
                }
                
                .section-nav-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(13, 110, 253, 0.1), transparent);
                    transition: left 0.5s ease;
                    z-index: 0;
                }
                
                .section-nav-link:hover::before {
                    left: 100%;
                }
                
                .section-nav-link:not(.section-nav-active):hover {
                    background-color: #e7f1ff !important;
                    color: #0d6efd !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.15);
                }
                
                .section-nav-link:not(.section-nav-active) {
                    cursor: pointer;
                }
                
                .section-nav-link:not(.section-nav-active):active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(13, 110, 253, 0.1);
                }
                
                .section-nav-active {
                    color: #fff !important;
                    background-color: #0d6efd !important;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.35);
                    transform: translateY(0);
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .section-nav-container {
                    animation: fadeIn 0.4s ease-out;
                }
            `}</style>
        </>
    );
}

