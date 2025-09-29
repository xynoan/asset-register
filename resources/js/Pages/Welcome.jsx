import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
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
            <main class="d-flex justify-content-center align-items-center flex-column vh-100">
                <form class="w-50 border border-black rounded-5 p-5">
                    <p class="fw-bold fs-3">Asset Register</p>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">First Name</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='John' />
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Last Name</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Doe' />
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Birth Date</label>
                        <input type="date" class="form-control" id="exampleInputPassword1" />
                    </div>
                    <button type="submit" class="btn btn-primary">Save</button>
                </form>
                <footer className="py-16 text-center text-sm text-black dark:text-white/70 mt-2">
                    Laravel v{laravelVersion} (PHP v{phpVersion})
                </footer>
            </main>
        </>
    );
}
