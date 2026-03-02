<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\TreePlacement;
use App\Models\User;
use App\Services\BinaryPlacementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BinaryTreePlacementTest extends TestCase
{
    use RefreshDatabase;

    private BinaryPlacementService $placementService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->placementService = app(BinaryPlacementService::class);
    }

    /** LEFT leg: 6 users form pure left-child chain A->L1->L2->L3->L4->L5->L6 (no right_child used). */
    public function test_left_leg_forms_pure_left_child_chain(): void
    {
        $root = User::factory()->create(['username' => 'root']);
        $users = [];
        for ($i = 1; $i <= 6; $i++) {
            $users[$i] = User::factory()->create([
                'username' => "left{$i}",
                'sponsor_id' => $root->id,
                'placement_side' => 'left',
            ]);
            $this->placementService->placeUser($users[$i], $root, 'left');
        }

        $root->refresh();
        $this->assertNotNull($root->left_child_id);
        $this->assertNull($root->right_child_id);

        $current = User::find($root->left_child_id);
        for ($i = 1; $i <= 6; $i++) {
            $this->assertSame($users[$i]->id, $current->id, "Position {$i} should be left{$i}");
            $this->assertNull($current->right_child_id, "Left leg must never use right_child (at left{$i})");
            $current = $current->left_child_id ? User::find($current->left_child_id) : null;
        }
        $this->assertNull($current);
    }

    /** RIGHT leg: 6 users form pure right-child chain A->R1->R2->R3->R4->R5->R6 (no left_child used). */
    public function test_right_leg_forms_pure_right_child_chain(): void
    {
        $root = User::factory()->create(['username' => 'root']);
        $users = [];
        for ($i = 1; $i <= 6; $i++) {
            $users[$i] = User::factory()->create([
                'username' => "right{$i}",
                'sponsor_id' => $root->id,
                'placement_side' => 'right',
            ]);
            $this->placementService->placeUser($users[$i], $root, 'right');
        }

        $root->refresh();
        $this->assertNull($root->left_child_id);
        $this->assertNotNull($root->right_child_id);

        $current = User::find($root->right_child_id);
        for ($i = 1; $i <= 6; $i++) {
            $this->assertSame($users[$i]->id, $current->id, "Position {$i} should be right{$i}");
            $this->assertNull($current->left_child_id, "Right leg must never use left_child (at right{$i})");
            $current = $current->right_child_id ? User::find($current->right_child_id) : null;
        }
        $this->assertNull($current);
    }

    /** Placement creates tree_placements and audit_log TREE_PLACEMENT. */
    public function test_placement_logs_to_tree_placements_and_audit(): void
    {
        $root = User::factory()->create(['username' => 'root']);
        $user1 = User::factory()->create(['username' => 'u1', 'sponsor_id' => $root->id, 'placement_side' => 'left']);
        $this->placementService->placeUser($user1, $root, 'left');

        $placement = TreePlacement::where('new_user_id', $user1->id)->first();
        $this->assertNotNull($placement);
        $this->assertSame($root->id, $placement->sponsor_id);
        $this->assertSame('left', $placement->chosen_side);
        $this->assertSame($root->id, $placement->actual_parent_id);
        $this->assertSame('left_child', $placement->attached_as);
        $this->assertSame(0, $placement->depth_from_sponsor);

        $audit = AuditLog::where('action', 'TREE_PLACEMENT')->where('target_user_id', $user1->id)->first();
        $this->assertNotNull($audit);
        $this->assertSame('left', $audit->payload['chosen_side']);
        $this->assertSame('left_child', $audit->payload['attached_as']);
        $this->assertSame(0, $audit->payload['depth']);
        $this->assertSame($root->id, $audit->payload['parent_id']);
    }

    /** Spillover placement has correct depth and actual_parent. */
    public function test_spillover_placement_depth_and_parent(): void
    {
        $root = User::factory()->create(['username' => 'root']);
        $l1 = User::factory()->create(['username' => 'l1', 'sponsor_id' => $root->id, 'placement_side' => 'left']);
        $this->placementService->placeUser($l1, $root, 'left');
        $l2 = User::factory()->create(['username' => 'l2', 'sponsor_id' => $root->id, 'placement_side' => 'left']);
        $this->placementService->placeUser($l2, $root, 'left');

        $p2 = TreePlacement::where('new_user_id', $l2->id)->first();
        $this->assertNotNull($p2);
        $this->assertSame($root->id, $p2->sponsor_id);
        $this->assertSame($l1->id, $p2->actual_parent_id);
        $this->assertSame(1, $p2->depth_from_sponsor);
    }
}
