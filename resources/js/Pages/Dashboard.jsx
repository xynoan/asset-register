import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ assets, flash }) {
    const { auth } = usePage().props;
    const [commentInputs, setCommentInputs] = useState({});
    const [submitting, setSubmitting] = useState({});

    const handleCommentChange = (assetId, value) => {
        setCommentInputs(prev => ({ ...prev, [assetId]: value }));
    };

    const handleCommentSubmit = (assetId, e) => {
        e.preventDefault();
        const comment = commentInputs[assetId]?.trim();
        if (!comment || submitting[assetId]) return;

        setSubmitting(prev => ({ ...prev, [assetId]: true }));

        router.post(route('assets.comments', assetId), { comment }, {
            preserveScroll: true,
            onFinish: () => {
                setSubmitting(prev => ({ ...prev, [assetId]: false }));
                setCommentInputs(prev => ({ ...prev, [assetId]: '' }));
            },
        });
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'In-use': 'bg-success',
            'Spare': 'bg-info',
            'Under Maintenance': 'bg-warning',
            'Retired': 'bg-secondary'
        };
        return statusClasses[status] || 'bg-secondary';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-green-800 bg-green-50 border border-green-200 rounded">
                                {flash.success}
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="mb-4 text-lg font-semibold">Asset Comments</h3>
                            <p className="mb-4 text-sm text-gray-600">
                                Add quick comments to assets. Comments are automatically timestamped and attributed to you.
                            </p>
                            
                            {assets && assets.length > 0 ? (
                                <div className="space-y-4">
                                    {assets.map((asset) => (
                                        <div key={asset.id} className="p-4 border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold">{asset.asset_id}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {asset.asset_category} - {asset.brand_manufacturer} {asset.model_number}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${getStatusBadgeClass(asset.status)}`}>
                                                    {asset.status}
                                                </span>
                                            </div>
                                            
                                            <div className="mt-3">
                                                <textarea
                                                    className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows="2"
                                                    placeholder="Add a comment..."
                                                    value={commentInputs[asset.id] || ''}
                                                    onChange={(e) => handleCommentChange(asset.id, e.target.value)}
                                                />
                                                <form onSubmit={(e) => handleCommentSubmit(asset.id, e)}>
                                                    <button
                                                        type="submit"
                                                        disabled={!commentInputs[asset.id]?.trim() || submitting[asset.id]}
                                                        className="mt-2 px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        {submitting[asset.id] ? 'Submitting...' : 'Add Comment'}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No assets found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
