import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const alertPlaceholderRef = useRef(null);

    const showAlert = (message, type = 'danger') => {
        const alertPlaceholder = alertPlaceholderRef.current;
        if (!alertPlaceholder) return;

        // Clear any existing alerts
        alertPlaceholder.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   ${message}`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    };

    useEffect(() => {
        // Show error alert when errors occur
        if (errors.email) {
            showAlert(errors.email, 'danger');
        } else if (errors.password) {
            showAlert(errors.password, 'danger');
        }
    }, [errors.email, errors.password]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (errors) => {
                console.error('Login errors:', errors);
            },
            onSuccess: () => {
                console.log('Login successful');
            },
        });
    };

    return (
        <>
            <Head title="Login" />
            <main className="login-container d-flex justify-content-center align-items-center min-vh-100">
                <div className="login-card">
                    <div className="login-header">
                        <img
                            className="login-logo"
                            src={route('storage.private', 'kuga_corp_logo-removebg-preview.png')}
                            alt="Company Logo"
                        />
                        <h1 className="login-title">Welcome!</h1>
                        <p className="login-subtitle">Please sign in to your account</p>
                    </div>

                    <div id="liveAlertPlaceholder" ref={alertPlaceholderRef}></div>

                    {status && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {status}
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    )}

                    <form onSubmit={submit} className="login-form">
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="email"
                                required
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="floatingPassword"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="checkDefault"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="checkDefault">
                                    Remember me
                                </label>
                            </div>
                            {/* {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="forgot-password-link"
                                >
                                    Forgot password?
                                </Link>
                            )} */}
                        </div>

                        <button
                            className="btn btn-primary w-100 py-3 login-button"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>
            </main>

            <style>{`
                .login-container {
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .login-container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: float 20s infinite linear;
                }

                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    100% { transform: translate(-50px, -50px) rotate(360deg); }
                }

                .login-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                    padding: 40px;
                    width: 100%;
                    max-width: 420px;
                    position: relative;
                    z-index: 1;
                    animation: slideUp 0.5s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .login-logo {
                    width: 100%;
                    height: auto;
                    margin-bottom: 20px;
                    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .login-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 8px;
                }

                .login-subtitle {
                    color: #718096;
                    font-size: 14px;
                    margin: 0;
                }

                .login-form .form-floating {
                    position: relative;
                }

                .login-form .form-control {
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: all 0.3s ease;
                    background-color: #f7fafc;
                }

                .login-form .form-control:focus {
                    border-color: #667eea;
                    background-color: #fff;
                    box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.1);
                    transform: translateY(-2px);
                }

                .login-form .form-control.is-invalid {
                    border-color: #e53e3e;
                }

                .login-form .form-label {
                    color: #4a5568;
                    font-weight: 500;
                }

                .form-check-input {
                    border: 2px solid #cbd5e0;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .form-check-input:checked {
                    background-color: #2563eb;
                    border-color: #2563eb;
                }

                .form-check-label {
                    color: #4a5568;
                    cursor: pointer;
                    user-select: none;
                }

                .forgot-password-link {
                    color: #667eea;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .forgot-password-link:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }

                .login-button {
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                }

                .login-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .login-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .login-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .alert {
                    border-radius: 12px;
                    border: none;
                    margin-bottom: 20px;
                }

                @media (max-width: 576px) {
                    .login-card {
                        padding: 30px 20px;
                        margin: 10px;
                    }

                    .login-title {
                        font-size: 24px;
                    }
                }
            `}</style>
        </>
    );
}