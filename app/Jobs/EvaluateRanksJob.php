<?php

namespace App\Jobs;

use App\Models\Rank;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EvaluateRanksJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $ranks = Rank::orderBy('level')->get();

        User::query()->chunk(100, function ($users) use ($ranks) {
            foreach ($users as $user) {
                $lesserSide = min((float) $user->left_points_total, (float) $user->right_points_total);

                foreach ($ranks as $rank) {
                    if ($lesserSide >= (float) $rank->lesser_side_required) {
                        $user->userRanks()->syncWithoutDetaching([$rank->id => ['achieved_at' => now()]]);
                    }
                }
            }
        });
    }
}
