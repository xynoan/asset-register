<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Asset;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is an encoder.
     */
    public function isEncoder(): bool
    {
        return $this->role === 'encoder';
    }

    /**
     * Check if user is a regular user.
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Get assets created by this user.
     */
    public function createdAssets()
    {
        return $this->hasMany(Asset::class, 'created_by');
    }

    /**
     * Get assets updated by this user.
     */
    public function updatedAssets()
    {
        return $this->hasMany(Asset::class, 'updated_by');
    }

    /**
     * Get total count of assets associated with this user (created or updated).
     */
    public function getAssetsCountAttribute(): int
    {
        return $this->createdAssets()->count() + $this->updatedAssets()->count();
    }
}
