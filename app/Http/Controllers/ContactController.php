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
        $logoUrl = rtrim((string) config('app.url'), '/').'/images/brand/emailLogo.jpeg';

        Mail::send([], [], function ($mail) use ($receiver, $name, $email, $phone, $subject, $message, $logoUrl): void {
            $mail->to($receiver)
                ->replyTo($email, $name)
                ->subject('[Contact Form] '.$subject)
                ->html('
                    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#e2e8f0;background:#0f1322;padding:16px;">
                        <div style="max-width:640px;background:#1a1f31;border:1px solid #303650;border-radius:14px;padding:20px;margin:0 auto;">
                            <h2 style="margin:0 0 16px;color:#f8fafc;">New Contact Form Submission</h2>
                            <p><strong>Name:</strong> '.e($name).'</p>
                            <p><strong>Email:</strong> '.e($email).'</p>
                            <p><strong>Phone:</strong> '.e($phone ?: 'N/A').'</p>
                            <p><strong>Subject:</strong> '.e($subject).'</p>
                            <p><strong>Message:</strong></p>
                            <div style="padding:12px;border:1px solid #3a425f;border-radius:8px;background:#12172a;white-space:pre-wrap;">'.nl2br(e($message)).'</div>
                            <div style="margin-top:24px;padding-top:18px;border-top:1px solid #2a2f45;">
                                <img src="'.e($logoUrl).'" alt="AurumNode" style="max-width:320px;width:100%;height:auto;display:block;margin:0 0 14px;">
                                <p style="margin:0 0 10px;color:#cbd5e1;font-size:14px;line-height:1.65;">
                                    Welcome to AurumNode Community — where innovation meets opportunity, and your journey toward smarter digital asset growth begins.
                                    We&apos;re excited to have you with us — let&apos;s build, grow, and succeed together as one powerful network.
                                </p>
                                <p style="margin:0;color:#e2e8f0;font-size:14px;line-height:1.6;">
                                    Thanks &amp; Regards,<br>
                                    AurumNode Team
                                </p>
                            </div>
                        </div>
                    </div>
                ');
        });

        return back()->with('status', 'Thanks! Your message has been sent successfully.');
    }
}

