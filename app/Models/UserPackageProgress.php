<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPackageProgress extends Model
{
    protected $fillable = [
        'user_id',
        'package_id',
        'maxout_count',
        'last_maxed_out_at',
    ];

    protected function casts(): array
    {
        return [
            'maxout_count' => 'integer',
            'last_maxed_out_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
