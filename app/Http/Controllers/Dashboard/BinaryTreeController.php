<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BinaryTreeController extends Controller
{
    private const DEFAULT_DEPTH = 8;

    private const MAX_DEPTH_LIMIT = 50;

    public function index(Request $request): Response
    {
        $user = $request->user();
        $requestedDepth = (int) $request->query('depth', self::DEFAULT_DEPTH);
        $depth = max(1, min($requestedDepth, self::MAX_DEPTH_LIMIT));

        $tree = $this->buildTree($user, 0, $depth);
        $actualMaxDepth = $this->computeMaxDepth($tree, 0);

        return Inertia::render('Dashboard/BinaryTree', [
            'tree' => $tree,
            'leftTotal' => (float) $user->left_points_total,
            'rightTotal' => (float) $user->right_points_total,
            'maxDepth' => $actualMaxDepth,
            'requestedDepth' => $depth,
            'hasMore' => $actualMaxDepth >= $depth && ($user->left_child_id || $user->right_child_id),
        ]);
    }

    private function buildTree(User $user, int $depth, int $maxDepth): array
    {
        $node = [
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'status' => $user->status,
            'level' => $depth + 1,
            'left_points' => (float) $user->left_points_total,
            'right_points' => (float) $user->right_points_total,
            'left' => null,
            'right' => null,
        ];

        if ($depth >= $maxDepth) {
            return $node;
        }

        if ($user->left_child_id) {
            $leftChild = User::find($user->left_child_id);
            if ($leftChild) {
                $node['left'] = $this->buildTree($leftChild, $depth + 1, $maxDepth);
            }
        }

        if ($user->right_child_id) {
            $rightChild = User::find($user->right_child_id);
            if ($rightChild) {
                $node['right'] = $this->buildTree($rightChild, $depth + 1, $maxDepth);
            }
        }

        return $node;
    }

    private function computeMaxDepth(array $node, int $currentDepth): int
    {
        $depth = $currentDepth + 1;
        if (! empty($node['left'])) {
            $depth = max($depth, $this->computeMaxDepth($node['left'], $currentDepth + 1));
        }
        if (! empty($node['right'])) {
            $depth = max($depth, $this->computeMaxDepth($node['right'], $currentDepth + 1));
        }

        return $depth;
    }
}
