<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolumePointsLog extends Model
{
    protected $fillable = ['user_id', 'date', 'left_points', 'right_points', 'source'];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'left_points' => 'decimal:2',
            'right_points' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
