<?php

namespace App\Mail;

use App\Models\KycDocument;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KycSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public KycDocument $document
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'KYC document submitted - Aurum Node',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.kyc-submitted',
        );
    }
}

