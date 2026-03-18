<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'min:10', 'max:4000'],
        ]);

        $receiver = config('mail.from.address');
        if (! $receiver) {
            return back()->withErrors([
                'form' => 'Contact email is not configured on server. Please set MAIL_FROM_ADDRESS in environment.',
            ]);
        }

        $name = trim((string) $validated['name']);
        $email = trim((string) $validated['email']);
        $phone = trim((string) ($validated['phone'] ?? ''));
        $subject = trim((string) $validated['subject']);
        $message = trim((string) $validated['message']);

        Mail::send([], [], function ($mail) use ($receiver, $name, $email, $phone, $subject, $message): void {
            $mail->to($receiver)
                ->replyTo($email, $name)
                ->subject('[Contact Form] '.$subject)
                ->html('
                    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827;">
                        <h2 style="margin:0 0 16px;">New Contact Form Submission</h2>
                        <p><strong>Name:</strong> '.e($name).'</p>
                        <p><strong>Email:</strong> '.e($email).'</p>
                        <p><strong>Phone:</strong> '.e($phone ?: 'N/A').'</p>
                        <p><strong>Subject:</strong> '.e($subject).'</p>
                        <p><strong>Message:</strong></p>
                        <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;white-space:pre-wrap;">'.nl2br(e($message)).'</div>
                    </div>
                ');
        });

        return back()->with('status', 'Thanks! Your message has been sent successfully.');
    }
}

