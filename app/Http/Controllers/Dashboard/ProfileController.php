<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Mail\KycSubmittedMail;
use App\Mail\TransactionPasswordVerifyMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
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

        $token = Str::random(64);
        $passwordHash = Hash::make($request->transaction_password);
        $cacheKey = 'tx_pw_verify_'.$token;
        Cache::put($cacheKey, [
            'user_id' => $user->id,
            'password_hash' => $passwordHash,
        ], now()->addMinutes(60));

        $verifyUrl = URL::temporarySignedRoute(
            'dashboard.profile.transaction-password.verify',
            now()->addMinutes(60),
            ['token' => $token]
        );

        Mail::to($user->email)->send(new TransactionPasswordVerifyMail($user, $verifyUrl));

        return back()->with('status', 'A verification email has been sent. Click the link in the email to set your transaction password.');
    }

    public function verifyTransactionPassword(Request $request): RedirectResponse
    {
        if (! $request->hasValidSignature()) {
            return redirect()->route('dashboard.profile')->with('error', 'Verification link has expired or is invalid.');
        }

        $token = $request->query('token');
        if (! $token) {
            return redirect()->route('dashboard.profile')->with('error', 'Invalid verification link.');
        }

        $cacheKey = 'tx_pw_verify_'.$token;
        $data = Cache::get($cacheKey);
        if (! $data || ($data['user_id'] ?? 0) !== $request->user()->id) {
            return redirect()->route('dashboard.profile')->with('error', 'Verification link has expired or was already used.');
        }

        $request->user()->update([
            'transaction_password' => $data['password_hash'],
        ]);
        Cache::forget($cacheKey);

        return redirect()->route('dashboard.profile')->with('status', 'Transaction password has been set successfully.');
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

        $document = $user->kycDocuments()->create([
            'document_type' => $request->document_type,
            'file_path' => $path,
            'status' => 'pending',
        ]);

        Mail::to($user->email)->send(new KycSubmittedMail($user, $document));

        return back()->with('status', 'Document uploaded.');
    }
}
