<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\TreePlacement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Binary tree placement with OUTER-ONLY spillover on both legs.
 * - LEFT leg: only left_child slots (chain A -> L1 -> L2 -> L3 ...).
 * - RIGHT leg: only right_child slots (chain A -> R1 -> R2 -> R3 ...).
 */
class BinaryPlacementService
{
    /**
     * Place new user under sponsor on the given side.
     * If sponsor's direct slot is empty, place there. Otherwise outer-only spillover:
     * walk down the chain (left-only or right-only) and place at first available slot.
     *
     * @return User The user under whom the new user was placed (actual binary parent)
     */
    public function placeUser(User $newUser, User $sponsor, string $side, ?int $adminId = null): User
    {
        if (! in_array($side, ['left', 'right'], true)) {
            $side = 'left';
        }

        $parentColumn = $side === 'left' ? 'left_child_id' : 'right_child_id';
        $attachedAs = $side === 'left' ? TreePlacement::ATTACHED_LEFT : TreePlacement::ATTACHED_RIGHT;

        // Step 1: Sponsor's chosen direct slot empty -> place there
        if (empty($sponsor->{$parentColumn})) {
            $this->assignChild($sponsor, $newUser, $side);
            $this->logPlacement($sponsor, $newUser, $side, $sponsor, $attachedAs, 0, $adminId);

            return $sponsor;
        }

        // Step 2: Outer-only spillover - walk chain to leaf on that side
        $depth = 0;
        $current = User::find($sponsor->{$parentColumn});

        if ($side === 'left') {
            while ($current->left_child_id) {
                $current = User::find($current->left_child_id);
                $depth++;
            }
            $this->assignChild($current, $newUser, 'left');
            $attachedAs = TreePlacement::ATTACHED_LEFT;
        } else {
            while ($current->right_child_id) {
                $current = User::find($current->right_child_id);
                $depth++;
            }
            $this->assignChild($current, $newUser, 'right');
            $attachedAs = TreePlacement::ATTACHED_RIGHT;
        }

        $depth++; // depth of new user from sponsor (1 = direct under sponsor's child, etc.)
        $this->logPlacement($sponsor, $newUser, $side, $current, $attachedAs, $depth, $adminId);

        return $current;
    }

    private function assignChild(User $parent, User $child, string $side): void
    {
        $column = $side === 'left' ? 'left_child_id' : 'right_child_id';

        DB::transaction(function () use ($parent, $child, $column) {
            $parent->update([$column => $child->id]);
            $child->update(['binary_parent_id' => $parent->id]);
        });
    }

    private function logPlacement(
        User $sponsor,
        User $newUser,
        string $chosenSide,
        User $actualParent,
        string $attachedAs,
        int $depthFromSponsor,
        ?int $adminId
    ): void {
        DB::transaction(function () use ($sponsor, $newUser, $chosenSide, $actualParent, $attachedAs, $depthFromSponsor, $adminId) {
            $placement = TreePlacement::create([
                'sponsor_id' => $sponsor->id,
                'new_user_id' => $newUser->id,
                'chosen_side' => $chosenSide,
                'actual_parent_id' => $actualParent->id,
                'attached_as' => $attachedAs,
                'depth_from_sponsor' => $depthFromSponsor,
            ]);

            AuditLog::create([
                'admin_id' => $adminId,
                'target_user_id' => $newUser->id,
                'action' => 'TREE_PLACEMENT',
                'model_type' => TreePlacement::class,
                'model_id' => $placement->id,
                'payload' => [
                    'chosen_side' => $chosenSide,
                    'attached_as' => $attachedAs,
                    'depth' => $depthFromSponsor,
                    'parent_id' => $actualParent->id,
                    'sponsor_id' => $sponsor->id,
                ],
            ]);
        });
    }
}
