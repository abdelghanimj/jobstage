<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class JobOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'category_id',
        'title',
        'type',
        'location',
        'description',
        'requirements',
        'salary',
        'application_deadline',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'application_deadline' => 'date',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_skill', 'job_offer_id', 'skill_id');
    }
}
