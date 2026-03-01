<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $kycDocuments = $user->kycDocuments()->latest()->get();

        return Inertia::render('Dashboard/Profile', [
            'kycDocuments' => $kycDocuments,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$request->user()->id],
            'mobile' => ['nullable', 'string', 'max:30'],
            'country' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string'],
            'usdt_address' => ['nullable', 'string', 'max:255'],
        ]);

        $request->user()->update($validated);

        return back()->with('status', 'Profile updated.');
    }

    public function transactionPassword(Request $request): RedirectResponse
    {
        $user = $request->user();

        $rules = [
            'transaction_password' => ['required', 'confirmed', Password::defaults()],
        ];

        if ($user->transaction_password) {
            $rules['current_transaction_password'] = ['required', function ($attr, $val, $fail) use ($user) {
                if (! Hash::check($val, $user->transaction_password)) {
                    $fail('Current transaction password is incorrect.');
                }
            }];
        }

        $request->validate($rules);

        $user->update([
            'transaction_password' => Hash::make($request->transaction_password),
        ]);

        return back()->with('status', 'Transaction password updated.');
    }

    public function kyc(Request $request): RedirectResponse
    {
        $request->validate([
            'document_type' => ['required', 'string', 'in:id_front,id_back,selfie'],
            'document' => ['required', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:5120'],
        ]);

        $user = $request->user();
        $file = $request->file('document');
        $path = $file->store('kyc/'.$user->id, 'local');

        $user->kycDocuments()->create([
            'document_type' => $request->document_type,
            'file_path' => $path,
            'status' => 'pending',
        ]);

        return back()->with('status', 'Document uploaded.');
    }
}
