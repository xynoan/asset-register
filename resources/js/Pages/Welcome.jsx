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
            <main class="fs-1">
                <h1>Asset Register</h1>
            </main>

            <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                Laravel v{laravelVersion} (PHP v{phpVersion})
            </footer>
        </>
    );
}
