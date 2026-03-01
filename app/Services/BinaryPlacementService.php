<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Binary tree placement with BFS spillover.
 * Rule: Place under sponsor on selected side; if occupied, BFS spillover left-to-right.
 */
class BinaryPlacementService
{
    /**
     * Place new user under sponsor on the given side.
     * If side is occupied, perform BFS spillover to find first available slot.
     *
     * @return User The user under whom the new user was placed (binary parent)
     */
    public function placeUser(User $newUser, User $sponsor, string $side): User
    {
        if (! in_array($side, ['left', 'right'], true)) {
            $side = 'left';
        }

        $parentColumn = $side === 'left' ? 'left_child_id' : 'right_child_id';
        $parent = $sponsor;

        // Check if sponsor's side is empty
        if (empty($sponsor->{$parentColumn})) {
            $this->assignChild($sponsor, $newUser, $side);

            return $sponsor;
        }

        // BFS spillover: find first available slot on that side
        $queue = [$sponsor->{$parentColumn}]; // start with the child on that side

        while (! empty($queue)) {
            $currentId = array_shift($queue);
            $current = User::find($currentId);

            if (! $current) {
                continue;
            }

            // Try left first (left-to-right), then right
            if (empty($current->left_child_id)) {
                $this->assignChild($current, $newUser, 'left');

                return $current;
            }

            if (empty($current->right_child_id)) {
                $this->assignChild($current, $newUser, 'right');

                return $current;
            }

            $queue[] = $current->left_child_id;
            $queue[] = $current->right_child_id;
        }

        // Fallback: should not reach here if tree is consistent
        throw new \RuntimeException('Could not find placement slot in binary tree.');
    }

    private function assignChild(User $parent, User $child, string $side): void
    {
        $column = $side === 'left' ? 'left_child_id' : 'right_child_id';

        DB::transaction(function () use ($parent, $child, $column) {
            $parent->update([$column => $child->id]);
            $child->update(['binary_parent_id' => $parent->id]);
        });
    }
}
