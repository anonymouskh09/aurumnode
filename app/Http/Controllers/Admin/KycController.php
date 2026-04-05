<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\KycApprovedMail;
use App\Models\AuditLog;
use App\Models\KycDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class KycController extends Controller
{
    public function index(): Response
    {
        $allDocuments = KycDocument::with('user')->latest()->get();
        $groupedRows = $allDocuments
            ->groupBy(fn (KycDocument $document) => $document->batch_ref ?: 'legacy-'.$document->id)
            ->map(function (Collection $group) {
                /** @var KycDocument $lead */
                $lead = $group->sortByDesc('id')->first();
                $statuses = $group->pluck('status')->filter()->unique()->values();
                $status = $statuses->contains('pending')
                    ? 'pending'
                    : ($statuses->contains('rejected') ? 'rejected' : 'approved');

                return [
                    'id' => $lead->id,
                    'batch_ref' => $lead->batch_ref ?: 'legacy-'.$lead->id,
                    'user' => $lead->user,
                    'status' => $status,
                    'created_at' => optional($group->sortBy('created_at')->first()->created_at)->toDateTimeString(),
                    'documents' => $group
                        ->sortBy('document_type')
                        ->map(fn (KycDocument $doc) => [
                            'id' => $doc->id,
                            'document_type' => $doc->document_type,
                            'status' => $doc->status,
                            'view_url' => route('admin.kyc.view', $doc),
                        ])
                        ->values(),
                ];
            })
            ->sortByDesc('created_at')
            ->values();

        $page = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 20;
        $documents = new LengthAwarePaginator(
            $groupedRows->forPage($page, $perPage)->values(),
            $groupedRows->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        return Inertia::render('Admin/Kyc', ['documents' => $documents]);
    }

    public function view(KycDocument $document): BinaryFileResponse
    {
        abort_unless($document->file_path, 404);

        $disk = Storage::disk('local');
        $pathOnDisk = null;

        if ($disk->exists($document->file_path)) {
            $pathOnDisk = $disk->path($document->file_path);
        } else {
            // Backward compatibility for files stored before local disk root changed.
            $legacyPath = storage_path('app/'.$document->file_path);
            if (is_file($legacyPath)) {
                $pathOnDisk = $legacyPath;
            }
        }

        if (! $pathOnDisk || ! is_file($pathOnDisk)) {
            abort(404, 'Document file not found.');
        }

        return response()->file($pathOnDisk, [
            'Content-Disposition' => 'inline; filename="'.basename($document->file_path).'"',
        ]);
    }

    public function approve(Request $request, KycDocument $document): RedirectResponse
    {
        $query = KycDocument::query()->where('user_id', $document->user_id);
        if ($document->batch_ref) {
            $query->where('batch_ref', $document->batch_ref);
        } else {
            $query->whereKey($document->id);
        }
        $documents = $query->get();
        $query->where('status', 'pending')->update(['status' => 'approved']);

        Mail::to($document->user->email)->send(new KycApprovedMail($document->user, $documents->first() ?? $document));
        AuditLog::create([
            'admin_id' => $request->user()->id,
            'action' => 'kyc_approved',
            'model_type' => KycDocument::class,
            'model_id' => $document->id,
            'payload' => [
                'batch_ref' => $document->batch_ref,
                'documents' => $documents->pluck('id')->values(),
            ],
        ]);

        return back()->with('status', 'KYC approved for this submission.');
    }

    public function reject(Request $request, KycDocument $document): RedirectResponse
    {
        $query = KycDocument::query()->where('user_id', $document->user_id);
        if ($document->batch_ref) {
            $query->where('batch_ref', $document->batch_ref);
        } else {
            $query->whereKey($document->id);
        }
        $documents = $query->get();
        $query->where('status', 'pending')->update(['status' => 'rejected']);
        AuditLog::create([
            'admin_id' => $request->user()->id,
            'action' => 'kyc_rejected',
            'model_type' => KycDocument::class,
            'model_id' => $document->id,
            'payload' => [
                'batch_ref' => $document->batch_ref,
                'documents' => $documents->pluck('id')->values(),
            ],
        ]);

        return back()->with('status', 'KYC rejected for this submission.');
    }
}
