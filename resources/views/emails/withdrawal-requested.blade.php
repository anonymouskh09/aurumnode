<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Withdrawal request received</title>
</head>
<body style="margin:0;background:#0f1322;padding:24px;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#1a1f31;border:1px solid #303650;border-radius:14px;padding:24px;color:#f8fafc;">
    <img
        src="{{ rtrim(config('app.url'), '/') . '/images/brand/emailLogo.jpeg' }}"
        alt="AurumNode"
        style="width:100%;max-width:592px;height:auto;display:block;border-radius:10px;margin:0 0 18px;"
    >
    <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#f8fafc;">Withdrawal request received</h1>
    <p style="margin:0 0 12px;color:#cbd5e1;">Hi {{ $user->name }},</p>
    <p style="margin:0 0 14px;color:#cbd5e1;line-height:1.7;">
        Your withdrawal request has been submitted successfully and is now pending review.
    </p>
    <div style="margin:0 0 14px;padding:12px;border:1px solid #3a425f;border-radius:10px;background:#12172a;">
        <p style="margin:0 0 6px;color:#cbd5e1;"><strong>Amount:</strong> ${{ number_format((float) $withdrawal->amount, 2) }}</p>
        <p style="margin:0 0 6px;color:#cbd5e1;"><strong>Fee:</strong> ${{ number_format((float) $withdrawal->fee_amount, 2) }}</p>
        <p style="margin:0;color:#cbd5e1;"><strong>Status:</strong> {{ ucfirst($withdrawal->status) }}</p>
    </div>
    <p style="margin:0;color:#94a3b8;font-size:13px;">
        You will receive another email once this request is approved or rejected.
    </p>

    @include('emails.partials.brand-footer')
</div>
</body>
</html>

