<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandManufacturer extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'brands_manufacturers';

    protected $fillable = [
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
