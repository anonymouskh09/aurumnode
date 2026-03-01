<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Rank extends Model
{
    protected $fillable = ['name', 'level', 'lesser_side_required', 'binary_percent'];

    protected function casts(): array
    {
        return [
            'lesser_side_required' => 'decimal:2',
            'binary_percent' => 'decimal:2',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_ranks')->withPivot('achieved_at')->withTimestamps();
    }
}
