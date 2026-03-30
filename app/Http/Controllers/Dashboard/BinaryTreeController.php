<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserPackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BinaryTreeController extends Controller
{
    private const DEFAULT_DEPTH = 4;

    private const MAX_DEPTH_LIMIT = 50;

    public function index(Request $request): Response
    {
        $user = $request->user();
        $requestedDepth = (int) $request->query('depth', self::DEFAULT_DEPTH);
        $depth = max(1, min($requestedDepth, self::MAX_DEPTH_LIMIT));
        $leftDirectPaid = $this->hasPaidDirect($user, User::PLACEMENT_LEFT);
        $rightDirectPaid = $this->hasPaidDirect($user, User::PLACEMENT_RIGHT);
        $missingSides = [];
        if (! $leftDirectPaid) {
            $missingSides[] = User::PLACEMENT_LEFT;
        }
        if (! $rightDirectPaid) {
            $missingSides[] = User::PLACEMENT_RIGHT;
        }

        $tree = $this->buildTree($user, 0, $depth);
        $actualMaxDepth = $this->computeMaxDepth($tree, 0);

        return Inertia::render('Dashboard/BinaryTree', [
            'tree' => $tree,
            'leftTotal' => (float) $user->left_points_total,
            'rightTotal' => (float) $user->right_points_total,
            'maxDepth' => $actualMaxDepth,
            'requestedDepth' => $depth,
            'hasMore' => $actualMaxDepth >= $depth && (($user->left_child_id || $user->right_child_id) || User::where('binary_parent_id', $user->id)->exists()),
            'binaryUnlock' => [
                'can_receive' => $leftDirectPaid && $rightDirectPaid,
                'left_paid' => $leftDirectPaid,
                'right_paid' => $rightDirectPaid,
                'missing_sides' => $missingSides,
            ],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $viewer = $request->user();
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['items' => []]);
        }

        $visibleIds = $this->getVisibleBinaryIds($viewer);
        if ($visibleIds === []) {
            return response()->json(['items' => []]);
        }

        $items = User::query()
            ->select(['id', 'username', 'name', 'status', 'left_points_total', 'right_points_total'])
            ->whereIn('id', $visibleIds)
            ->where(function ($query) use ($q) {
                $query->where('username', 'like', '%'.$q.'%')
                    ->orWhere('name', 'like', '%'.$q.'%');
            })
            ->orderByRaw("CASE WHEN username LIKE ? THEN 0 ELSE 1 END", [$q.'%'])
            ->orderBy('username')
            ->limit(15)
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'username' => $u->username,
                'name' => $u->name,
                'status' => $u->status,
                'left_points_total' => (float) $u->left_points_total,
                'right_points_total' => (float) $u->right_points_total,
            ])
            ->values();

        return response()->json(['items' => $items]);
    }

    public function details(Request $request, User $member): JsonResponse
    {
        $viewer = $request->user();
        $visibleIds = $this->getVisibleBinaryIds($viewer);

        if (! in_array($member->id, $visibleIds, true)) {
            abort(403);
        }

        $leftIds = $this->collectBranchIds($member->left_child_id);
        $rightIds = $this->collectBranchIds($member->right_child_id);
        $teamIds = array_values(array_unique(array_merge($leftIds, $rightIds)));

        $paidTeamCount = 0;
        $freeTeamCount = 0;
        if ($teamIds !== []) {
            $counts = User::query()
                ->whereIn('id', $teamIds)
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status');

            $paidTeamCount = (int) ($counts[User::STATUS_PAID] ?? 0);
            $freeTeamCount = (int) ($counts[User::STATUS_FREE] ?? 0);
        }

        $directTotal = (int) $member->referrals()->count();
        $directPaid = (int) $member->referrals()->where('status', User::STATUS_PAID)->count();
        $directFree = (int) $member->referrals()->where('status', User::STATUS_FREE)->count();
        $sponsorUsername = optional($member->sponsor)->username;
        $binaryParentUsername = optional($member->binaryParent)->username;

        return response()->json([
            'id' => $member->id,
            'username' => $member->username,
            'name' => $member->name,
            'email' => $member->email,
            'mobile' => $member->mobile,
            'country' => $member->country,
            'city' => $member->city,
            'placement_side' => $member->placement_side,
            'status' => $member->status,
            'sponsor_username' => $sponsorUsername,
            'binary_parent_username' => $binaryParentUsername,
            'left_points_total' => (float) $member->left_points_total,
            'right_points_total' => (float) $member->right_points_total,
            'total_volume' => (float) $member->left_points_total + (float) $member->right_points_total,
            'left_team_count' => count($leftIds),
            'right_team_count' => count($rightIds),
            'network_total_count' => count($teamIds),
            'network_paid_count' => $paidTeamCount,
            'network_free_count' => $freeTeamCount,
            'direct_total_count' => $directTotal,
            'direct_paid_count' => $directPaid,
            'direct_free_count' => $directFree,
        ]);
    }

    private function hasPaidDirect(User $user, string $side): bool
    {
        return $user->referrals()
            ->where('placement_side', $side)
            ->whereHas('userPackages', function ($q) {
                $q->where('status', UserPackage::STATUS_ACTIVE)
                    ->where('is_maxed_out', false)
                    ->where('invested_amount', '>', 0);
            })
            ->exists();
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

        $leftChild = $user->left_child_id ? User::find($user->left_child_id) : null;
        if (! $leftChild) {
            $leftChild = User::where('binary_parent_id', $user->id)->where('placement_side', 'left')->first();
        }
        if ($leftChild) {
            $node['left'] = $this->buildTree($leftChild, $depth + 1, $maxDepth);
        }

        $rightChild = $user->right_child_id ? User::find($user->right_child_id) : null;
        if (! $rightChild) {
            $rightChild = User::where('binary_parent_id', $user->id)->where('placement_side', 'right')->first();
        }
        if ($rightChild) {
            $node['right'] = $this->buildTree($rightChild, $depth + 1, $maxDepth);
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

    private function getVisibleBinaryIds(User $viewer): array
    {
        $descendants = $this->collectBranchIds($viewer->id);
        $descendants[] = $viewer->id;

        return array_values(array_unique($descendants));
    }

    private function collectBranchIds(?int $rootId): array
    {
        if (! $rootId) {
            return [];
        }

        $all = [];
        $current = [$rootId];

        while ($current !== []) {
            $all = array_merge($all, $current);

            $children = User::query()
                ->whereIn('binary_parent_id', $current)
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->all();

            $current = $children;
        }

        return array_values(array_unique($all));
    }
}
