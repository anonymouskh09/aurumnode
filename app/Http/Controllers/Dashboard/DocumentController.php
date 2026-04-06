<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AdminDocument;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentController extends Controller
{
    public function index(): Response
    {
        $documents = AdminDocument::query()
            ->where('is_active', true)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (AdminDocument $doc) => [
                'id' => $doc->id,
                'title' => $doc->title,
                'description' => $doc->description,
                'original_name' => $doc->original_name,
                'mime_type' => $doc->mime_type,
                'file_size' => $doc->file_size,
                'published_at' => optional($doc->published_at)->toDateTimeString(),
                'read_url' => route('dashboard.documents.read', $doc),
                'download_url' => route('dashboard.documents.download', $doc),
            ])
            ->values();

        return Inertia::render('Dashboard/Documents', [
            'documents' => $documents,
        ]);
    }

    public function read(AdminDocument $document): BinaryFileResponse
    {
        abort_unless($document->is_active, 404);

        $disk = Storage::disk('local');
        $path = null;
        if ($disk->exists($document->file_path)) {
            $path = $disk->path($document->file_path);
        } else {
            $legacyPath = storage_path('app/'.$document->file_path);
            if (is_file($legacyPath)) {
                $path = $legacyPath;
            }
        }
        if (! $path || ! is_file($path)) {
            abort(404, 'Document file not found.');
        }

        return response()->file($path, [
            'Content-Disposition' => 'inline; filename="'.basename($document->original_name ?: $document->file_path).'"',
        ]);
    }

    public function download(AdminDocument $document): BinaryFileResponse
    {
        abort_unless($document->is_active, 404);

        $disk = Storage::disk('local');
        $path = null;
        if ($disk->exists($document->file_path)) {
            $path = $disk->path($document->file_path);
        } else {
            $legacyPath = storage_path('app/'.$document->file_path);
            if (is_file($legacyPath)) {
                $path = $legacyPath;
            }
        }
        if (! $path || ! is_file($path)) {
            abort(404, 'Document file not found.');
        }

        return response()->download($path, $document->original_name);
    }
}

