<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Aurum Node</title>
</head>
<body style="margin:0;background:#0f1322;padding:24px;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#1a1f31;border:1px solid #303650;border-radius:14px;padding:24px;color:#f8fafc;">
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:#f8fafc;">Welcome to Aurum Node</h1>
    <p style="margin:0 0 12px;color:#cbd5e1;">Hi {{ $user->name }},</p>
    <p style="margin:0 0 14px;color:#cbd5e1;line-height:1.7;">
        Your account has been created successfully. You can now sign in and start exploring your dashboard.
    </p>
    <p style="margin:0 0 20px;">
        <a href="{{ url('/login') }}" style="display:inline-block;background:#f59e0b;color:#111827;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600;">
            Log in to your account
        </a>
    </p>

    @include('emails.partials.brand-footer')
</div>
</body>
</html>
