<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_assets';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'asset_id',
        'asset_category',
        'brand_manufacturer',
        'model_number',
        'serial_number',
        'purchase_date',
        'vendor_supplier',
        'warranty_expiry_date',
        'status',
        'status_history',
        'status_changed_at',
        'maintenance_history',
        'comments_history',
        'document_paths',
        'assigned_to',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'purchase_date' => 'date',
        'warranty_expiry_date' => 'date',
        'status_history' => 'array',
        'status_changed_at' => 'datetime',
        'comments_history' => 'array',
        'document_paths' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee assigned to this asset.
     */
    public function assignedEmployee()
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    /**
     * Get the user who created this asset record.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this asset record.
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Record a status change in the status history.
     */
    public function recordStatusChange(string $newStatus, int $userId): void
    {
        $history = $this->status_history ?? [];
        
        $history[] = [
            'status' => $newStatus,
            'changed_at' => now()->toDateTimeString(),
            'changed_by' => $userId,
        ];

        $this->status_history = $history;
        $this->status_changed_at = now();
    }

    /**
     * Calculate the duration in days for the current status.
     */
    public function getStatusDurationDays(): ?int
    {
        if (!$this->status_changed_at) {
            return null;
        }

        return now()->diffInDays($this->status_changed_at);
    }

    /**
     * Get formatted status duration string.
     */
    public function getStatusDurationString(): string
    {
        $days = $this->getStatusDurationDays();
        
        if ($days === null) {
            return 'Unknown';
        }

        return "{$this->status} for {$days} " . ($days === 1 ? 'day' : 'days');
    }
}
