<?php

namespace Database\Seeders;

use App\Models\Rank;
use Illuminate\Database\Seeder;

class RankSeeder extends Seeder
{
    public function run(): void
    {
        $ranks = [
            ['name' => 'Team Leader', 'level' => 1, 'lesser_side_required' => 25000, 'binary_percent' => 10],
            ['name' => 'Team Manager', 'level' => 2, 'lesser_side_required' => 75000, 'binary_percent' => 10],
            ['name' => 'Executive', 'level' => 3, 'lesser_side_required' => 250000, 'binary_percent' => 10],
            ['name' => 'Senior Executive', 'level' => 4, 'lesser_side_required' => 750000, 'binary_percent' => 10],
            ['name' => 'Director', 'level' => 5, 'lesser_side_required' => 1500000, 'binary_percent' => 10],
            ['name' => 'Senior Director', 'level' => 6, 'lesser_side_required' => 3000000, 'binary_percent' => 10],
        ];

        foreach ($ranks as $r) {
            Rank::updateOrCreate(
                ['level' => $r['level']],
                $r
            );
        }
    }
}
