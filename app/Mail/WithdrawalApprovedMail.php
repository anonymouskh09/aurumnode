<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WithdrawalApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public Withdrawal $withdrawal
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Withdrawal approved - Aurum Node',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.withdrawal-approved',
        );
    }
}

