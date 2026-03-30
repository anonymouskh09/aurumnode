<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify transaction password</title>
</head>
<body style="margin:0;background:#0f1322;padding:24px;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#1a1f31;border:1px solid #303650;border-radius:14px;padding:24px;color:#f8fafc;">
    <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#f8fafc;">Verify your transaction password</h1>
    <p style="margin:0 0 12px;color:#cbd5e1;">Hi {{ $user->name }},</p>
    <p style="margin:0 0 14px;color:#cbd5e1;line-height:1.7;">
        You requested to set or update your transaction password. Click the button below to confirm. This secure link expires in 60 minutes.
    </p>
    <p style="margin:0 0 14px;">
        <a href="{{ $verifyUrl }}" style="display:inline-block;background:#f59e0b;color:#111827;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600;">
            Verify and set transaction password
        </a>
    </p>
    <p style="margin:0;color:#94a3b8;font-size:13px;">
        If you did not request this action, you can safely ignore this email.
    </p>

    @include('emails.partials.brand-footer')
</div>
</body>
</html>
