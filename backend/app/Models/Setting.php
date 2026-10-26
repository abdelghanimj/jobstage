<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'platform_name',
        'language',
        'description',
        'notifications_enabled',
        'maintenance_mode',
    ];

    protected function casts(): array
    {
        return [
            'notifications_enabled' => 'boolean',
            'maintenance_mode' => 'boolean',
        ];
    }
}
