<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BinaryTreeController extends Controller
{
    private const MAX_DEPTH = 5;

    public function index(Request $request): Response
    {
        $user = $request->user();
        $tree = $this->buildTree($user, 0);

        return Inertia::render('Dashboard/BinaryTree', [
            'tree' => $tree,
            'leftTotal' => (float) $user->left_points_total,
            'rightTotal' => (float) $user->right_points_total,
        ]);
    }

    private function buildTree(User $user, int $depth): array
    {
        $node = [
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'status' => $user->status,
            'left_points' => (float) $user->left_points_total,
            'right_points' => (float) $user->right_points_total,
            'left' => null,
            'right' => null,
        ];

        if ($depth >= self::MAX_DEPTH) {
            return $node;
        }

        if ($user->left_child_id) {
            $leftChild = User::find($user->left_child_id);
            if ($leftChild) {
                $node['left'] = $this->buildTree($leftChild, $depth + 1);
            }
        }

        if ($user->right_child_id) {
            $rightChild = User::find($user->right_child_id);
            if ($rightChild) {
                $node['right'] = $this->buildTree($rightChild, $depth + 1);
            }
        }

        return $node;
    }
}
