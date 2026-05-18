<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VolumePointsLog;
use App\Services\VolumeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminVolumeAdjustTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_remove_volume_from_user_leg(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create([
            'is_admin' => false,
            'left_points_total' => 500,
            'right_points_total' => 200,
        ]);

        VolumePointsLog::create([
            'user_id' => $member->id,
            'date' => now()->toDateString(),
            'left_points' => 500,
            'right_points' => 200,
            'source' => 'manual',
        ]);

        app(VolumeService::class)->removeVolume($member, 'left', 300, $admin, 'Test cleanup');

        $member->refresh();
        $log = VolumePointsLog::where('user_id', $member->id)->whereDate('date', today())->first();

        $this->assertEqualsWithDelta(200.0, (float) $member->left_points_total, 0.01);
        $this->assertEqualsWithDelta(200.0, (float) $member->right_points_total, 0.01);
        $this->assertNotNull($log);
        $this->assertEqualsWithDelta(200.0, (float) $log->left_points, 0.01);
    }

    public function test_remove_volume_does_not_go_below_zero(): void
    {
        $member = User::factory()->create([
            'is_admin' => false,
            'left_points_total' => 50,
        ]);

        app(VolumeService::class)->removeVolume($member, 'left', 200);

        $member->refresh();

        $this->assertEqualsWithDelta(0.0, (float) $member->left_points_total, 0.01);
    }

    public function test_admin_volume_subtract_route_works(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create([
            'is_admin' => false,
            'right_points_total' => 1000,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.volume.subtract'), [
            'user_id' => $member->id,
            'leg' => 'right',
            'points' => 250,
            'reason' => 'Adjust test',
        ]);

        $response->assertRedirect(route('admin.volume.index', ['user_id' => $member->id]));
        $member->refresh();

        $this->assertEqualsWithDelta(750.0, (float) $member->right_points_total, 0.01);
    }
}
