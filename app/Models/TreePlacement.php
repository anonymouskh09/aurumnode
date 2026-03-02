<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TreePlacement extends Model
{
    public const SIDE_LEFT = 'left';

    public const SIDE_RIGHT = 'right';

    public const ATTACHED_LEFT = 'left_child';

    public const ATTACHED_RIGHT = 'right_child';

    protected $fillable = [
        'sponsor_id',
        'new_user_id',
        'chosen_side',
        'actual_parent_id',
        'attached_as',
        'depth_from_sponsor',
    ];

    protected function casts(): array
    {
        return [
            'depth_from_sponsor' => 'integer',
        ];
    }

    public function sponsor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sponsor_id');
    }

    public function newUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'new_user_id');
    }

    public function actualParent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actual_parent_id');
    }
}
