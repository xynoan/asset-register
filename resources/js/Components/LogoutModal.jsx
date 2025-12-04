import { router } from '@inertiajs/react';

export default function LogoutModal({ show, onClose }) {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    if (!show) return null;

    return (
        <>
            <div 
                className="modal fade show" 
                style={{ display: 'block' }} 
                tabIndex="-1" 
                role="dialog"
                onClick={onClose}
            >
                <div 
                    className="modal-dialog modal-dialog-centered" 
                    role="document"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Logout</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to logout?</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}

