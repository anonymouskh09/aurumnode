<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminVolumeSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_search_volume_page_by_username(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create([
            'is_admin' => false,
            'username' => 'kashifdxb1',
            'name' => 'Kashif Javeed',
            'email' => 'kashif@example.com',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.volume.index', ['search' => 'kashif']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Volume/Index')
            ->where('user.id', $member->id)
            ->where('filters.search', 'kashif')
        );
    }

    public function test_admin_sees_multiple_search_results_to_select(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->create(['is_admin' => false, 'username' => 'kashif_one', 'name' => 'Kashif One']);
        User::factory()->create(['is_admin' => false, 'username' => 'kashif_two', 'name' => 'Kashif Two']);

        $response = $this->actingAs($admin)->get(route('admin.volume.index', ['search' => 'kashif']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Volume/Index')
            ->where('user', null)
            ->has('searchResults', 2)
        );
    }

    public function test_admin_can_select_user_from_search_results(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create([
            'is_admin' => false,
            'username' => 'selected_user',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.volume.index', [
            'search' => 'selected',
            'user_id' => $member->id,
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('user.id', $member->id)
            ->where('filters.search', 'selected')
        );
    }
}
