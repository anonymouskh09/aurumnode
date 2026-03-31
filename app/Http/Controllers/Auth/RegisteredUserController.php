<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\BinaryPlacementService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     * Referral-only: show form with optional pre-filled sponsor from URL (ref param or sponsor username).
     */
    public function create(Request $request): Response|RedirectResponse
    {
        // Referral from URL: ?ref=username or ?ref=username&side=left|right
        $ref = $request->query('ref');
        $side = $request->query('side', 'left');

        if (! in_array($side, ['left', 'right'], true)) {
            $side = 'left';
        }

        $referralUsername = null;
        $referralSide = null;

        if ($ref) {
            $sponsor = User::where('username', $ref)->first();
            if ($sponsor) {
                $referralUsername = $sponsor->username;
                $referralSide = $side;
            }
        }

        return Inertia::render('Register', [
            'referralUsername' => $referralUsername,
            'referralSide' => $referralSide,
        ]);
    }

    /**
     * Handle an incoming registration request.
     * Sponsor is optional - users can register with or without a sponsor.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username', 'alpha_dash'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'mobile' => ['nullable', 'string', 'max:30', 'regex:/^\+\d{6,20}$/', 'unique:users,mobile'],
            'sponsor_username' => ['required', 'string', 'exists:users,username'],
            'placement_side' => ['required', 'in:left,right'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        $sponsor = User::where('username', $validated['sponsor_username'])->firstOrFail();

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'mobile' => $validated['mobile'] ?? null,
            'password' => Hash::make($validated['password']),
            'sponsor_id' => $sponsor->id,
            'placement_side' => $validated['placement_side'],
            'status' => User::STATUS_FREE,
        ]);

        app(BinaryPlacementService::class)->placeUser($user, $sponsor, $validated['placement_side']);

        event(new Registered($user));
        Mail::to($user->email)->send(new WelcomeMail($user));

        Auth::login($user);

        return redirect(route('dashboard.index'));
    }
}
