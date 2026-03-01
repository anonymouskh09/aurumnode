<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\KycDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KycController extends Controller
{
    public function index(): Response
    {
        $documents = KycDocument::with('user')->where('status', 'pending')->latest()->paginate(20);

        return Inertia::render('Admin/Kyc', ['documents' => $documents]);
    }

    public function approve(Request $request, KycDocument $document): RedirectResponse
    {
        $document->update(['status' => 'approved']);
        AuditLog::create(['admin_id' => $request->user()->id, 'action' => 'kyc_approved', 'model_type' => KycDocument::class, 'model_id' => $document->id]);

        return back()->with('status', 'KYC approved.');
    }

    public function reject(Request $request, KycDocument $document): RedirectResponse
    {
        $document->update(['status' => 'rejected']);
        AuditLog::create(['admin_id' => $request->user()->id, 'action' => 'kyc_rejected', 'model_type' => KycDocument::class, 'model_id' => $document->id]);

        return back()->with('status', 'KYC rejected.');
    }
}
