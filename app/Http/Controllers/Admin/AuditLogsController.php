<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin: Audit logs viewer with filters.
 */
class AuditLogsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AuditLog::with(['admin:id,name,username', 'targetUser:id,name,username']);

        if ($request->filled('admin_id')) {
            $query->where('admin_id', $request->admin_id);
        }
        if ($request->filled('target_user_id')) {
            $query->where('target_user_id', $request->target_user_id);
        }
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $logs = $query->latest()->paginate(50)->withQueryString();

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['admin_id', 'target_user_id', 'action', 'from', 'to']),
        ]);
    }
}
