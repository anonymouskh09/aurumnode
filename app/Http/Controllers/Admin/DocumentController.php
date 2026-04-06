<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentController extends Controller
{
    public function index(): Response
    {
        $documents = AdminDocument::with('creator:id,username,name')
            ->latest()
            ->paginate(20)
            ->through(fn (AdminDocument $doc) => [
                'id' => $doc->id,
                'title' => $doc->title,
                'description' => $doc->description,
                'original_name' => $doc->original_name,
                'mime_type' => $doc->mime_type,
                'file_size' => $doc->file_size,
                'is_active' => $doc->is_active,
                'published_at' => optional($doc->published_at)->toDateTimeString(),
                'created_at' => optional($doc->created_at)->toDateTimeString(),
                'creator' => $doc->creator,
                'download_url' => route('admin.documents.download', $doc),
            ]);

        return Inertia::render('Admin/Documents', [
            'documents' => $documents,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'document' => ['required', 'file', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png,zip,rar', 'max:20480'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $file = $request->file('document');
        $path = $file->store('documents/admin', 'local');
        $isActive = (bool) ($validated['is_active'] ?? true);

        AdminDocument::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'is_active' => $isActive,
            'published_at' => $isActive ? now() : null,
            'created_by' => $request->user()->id,
        ]);

        return back()->with('status', 'Document uploaded successfully.');
    }

    public function toggle(AdminDocument $document): RedirectResponse
    {
        $next = ! $document->is_active;
        $document->update([
            'is_active' => $next,
            'published_at' => $next ? ($document->published_at ?? now()) : null,
        ]);

        return back()->with('status', $next ? 'Document published.' : 'Document hidden from users.');
    }

    public function destroy(AdminDocument $document): RedirectResponse
    {
        $disk = Storage::disk('local');
        if ($document->file_path && $disk->exists($document->file_path)) {
            $disk->delete($document->file_path);
        }

        $document->delete();

        return back()->with('status', 'Document deleted.');
    }

    public function download(AdminDocument $document): BinaryFileResponse
    {
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

