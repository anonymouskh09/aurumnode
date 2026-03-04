<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionPasswordVerifyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $verifyUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify your transaction password – Aurum Node',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.transaction-password-verify',
        );
    }
}
