<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\BinaryPlacementService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([PackageSeeder::class, RankSeeder::class, LeaderPackageSeeder::class, SettingsSeeder::class]);

        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin User',
                'email' => 'admin@aurumnode.test',
                'password' => Hash::make('password'),
                'sponsor_id' => null,
                'placement_side' => null,
                'status' => User::STATUS_FREE,
                'is_admin' => true,
            ]
        );

        if (! $admin->is_admin) {
            $admin->update(['is_admin' => true]);
        }

        $testUser = User::firstOrCreate(
            ['username' => 'testuser'],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
                'sponsor_id' => $admin->id,
                'placement_side' => User::PLACEMENT_LEFT,
                'status' => User::STATUS_FREE,
            ]
        );

        if (! $testUser->binary_parent_id) {
            app(BinaryPlacementService::class)->placeUser($testUser, $admin, 'left');
        }
    }
}
