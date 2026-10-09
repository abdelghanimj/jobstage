<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function candidates(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'candidate_skill',
            'skill_id',
            'candidate_id'
        );
    }

    public function jobOffers(): BelongsToMany
    {
        return $this->belongsToMany(
            JobOffer::class,
            'job_skill',
            'skill_id',
            'job_offer_id'
        );
    }
}
